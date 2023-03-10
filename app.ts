import { StatusCodes } from "http-status-codes";
import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { corsOptions, routePaths, STATIC_FOLDER_PATH } from "./utils/constants";
import AppError from "./utils/AppError";
import { globalErrorHandler } from "./controllers";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import {
  authRouter,
  userRouter,
  courseOutlineRouter,
  courseRouter,
  postRouter,
} from "./routes";
import { joinStrings } from "./utils/helpers";

dotenv.config({ path: path.join(__dirname, "../config.env") });

const app: Express = express();

//GLOBAL MIDDLEWARES - start

// API SECURITY - START //

app.use(cors(corsOptions));
app.use(helmet());

/**
 * Should be aloways on top middleware
 *
 * Rate Limit from same IP
 *
 * Allow 100 requests from same IP in 1 hour
 *
 * When app crashed or restarted then the limit also reset to max limit value. Means limit start from 100.
 *
 */

//TODO: Need to uncomment on production level
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: "Too many requests from this IP, Please try again in an hour!",
// });
//TODO: Should be apply only on development level, Remove on production level
const limiter = rateLimit({
  max: 1000000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, Please try again in an hour!",
});

/**
 * Apply rateLimit only to the '/api' route
 */

app.use("/api", limiter);

// API SECURITY - END //

//Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

/**
 * Body parser, reading data from body into req.body
 *
 * Limiting body data size to '10kb'
 *
 */
app.use(express.json());
// app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

/**
 * Data Sanitization agains NoSQL query Injection
 *
 * It looks at the request body, request query and request params and then it's filter out all the `$` signs and `.`
 *
 */

app.use(mongoSanitize());

/**
 * Data Sanitization agains XSS (cross-site-scripting)
 *
 * It prevents the malicius html scripts or javascripts comming thourgh the request body fields
 *
 * Ex: { name: "<div id='bad-code'> Foo </div>"}, This middleware converts it into &lt;div id='bad-code'> Foo &lt;/div>
 * It allow to insert the new converted code.
 */
// app.use(xss());

/**
 * Prevent parameter pollution
 *
 * if url is like (/api/tours?sort=duration&sort=price)  then there are duplicate keys 'sort'. So this middleware removes the duplication
 * and allow the value of the last filed. So this will be sorted by price. duration sort will be filtered out
 *
 * whitelist: ['duration'] ==> will allow the duration property to be duplicated in the query params
 */
app.use(
  hpp({
    whitelist: [],
  })
);

//serving static files
app.use(express.static(`${STATIC_FOLDER_PATH}`));

//ROUTES MOUNTING
app.use(routePaths.api, authRouter);
app.use(joinStrings(routePaths.api, routePaths.users), userRouter);
app.use(joinStrings(routePaths.api, routePaths.courses), courseRouter);
app.use(
  joinStrings(routePaths.api, routePaths.courseOutlines),
  courseOutlineRouter
);
app.use(joinStrings(routePaths.api, routePaths.posts), postRouter);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  if (req.path === "/api/v1") {
    return res.status(StatusCodes.OK).json({
      message: `Welcome to TheNinzaWorld!`,
    });
  }
  next(new AppError(`Couldn't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
