import mongoose from "mongoose";
import courseOutlineSchema from "./schema";
import { CourseOutline, CourseOutlineDocument } from "./types";

// courseOutlineSchema
//   .virtual("parent")
//   .get(function (this: CourseOutlineDocument) {
//     console.log("===> parent data: ", this.parent());
//     return this.parent();
//   });

// export const referenceParent = {
//   ref: "CourseOutline", //name of the model
//   foreignField: "parent", //parent -> is the property in CourseOutline model
//   localField: "_id", //_id is in CourseOutline model
// };
