import { Router } from "express";
import { healthRouter } from "./health.routes.js";
import { uploadRouter } from "./upload.routes.js";
import { projectRouter } from "./project.routes.js";
export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/uploads", uploadRouter);
apiRouter.use("/projects", projectRouter);