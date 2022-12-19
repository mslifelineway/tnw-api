import { StatusCodes } from "http-status-codes";
import { CourseOutline } from "../models";
import { CourseDocument } from "../models/course/types";
import { CourseOutlineDocument } from "../models/courseOutline/types";
import { courseOutlineStatus, messages } from "../utils/constants";

export interface CourseOutlineParentAndSublingsResponse {
  status: number;
  message: string;
  sublings?: CourseOutlineParentAndSublings;
}

export interface CourseOutlineParentAndSublings {
  course?: CourseDocument;
  outline?: CourseOutlineDocument;
  subOutline1?: CourseOutlineDocument;
  subOutline2?: CourseOutlineDocument;
  currentData?: CourseOutlineDocument;
  outlineStatus?: string;
}

export const getCourseOutlineParentAndSublings = async (
  id: string
): Promise<CourseOutlineParentAndSublingsResponse> => {
  const response: CourseOutlineParentAndSublingsResponse = {
    status: StatusCodes.OK,
    message: "Success",
  };
  const siblings: CourseOutlineParentAndSublings = {};

  const select: string = "name keywords";
  const populateParent = {
    path: "parent",
    select: "name keywords",
  };
  const populateCourse = {
    path: "course",
    select: "name keywords -user",
  };
  const populateOptions = [populateParent, populateCourse];

  let query = CourseOutline.findById(id, select).populate(populateOptions);

  const doc = await query;
  if (!doc) {
    response.status = StatusCodes.BAD_REQUEST;
    response.message = messages.documentNotFoundWithId;
    return response;
  }

  //course
  siblings.course = doc.course as CourseDocument;

  //selected outline
  const selectedOutline = {
    _id: doc._id,
    id: doc.id,
    name: doc.name,
    keywords: doc.keywords,
  } as CourseOutlineDocument;

  //current data info
  siblings.currentData = selectedOutline;

  const parentDocOfSelected = await CourseOutline.findById(
    doc.parent,
    "name parent"
  );

  if (parentDocOfSelected) {
    const parentData = {
      _id: parentDocOfSelected._id,
      id: parentDocOfSelected.id,
      name: parentDocOfSelected.name,
    } as CourseOutlineDocument;

    const outline = await CourseOutline.findById(
      parentDocOfSelected.parent,
      select
    );

    if (outline) {
      //when suboutline2 is selected
      siblings.outline = outline;
      siblings.subOutline1 = parentData;
      siblings.subOutline2 = selectedOutline;
      siblings.outlineStatus = courseOutlineStatus.subOutline2;
    } else {
      //when subOutline1 is selected
      siblings.outline = parentData;
      siblings.subOutline1 = selectedOutline;
      siblings.outlineStatus = courseOutlineStatus.subOutline1;
    }
  } else {
    siblings.outline = selectedOutline;
    siblings.outlineStatus = courseOutlineStatus.outline;
  }

  response.sublings = siblings;
  return response;
};
