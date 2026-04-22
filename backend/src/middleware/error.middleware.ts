import type { NextFunction, Request, Response } from "express";
export function notFound(req: Request, res: Response) {
res.status(404).json({
success: false,
error: { code: "NOT_FOUND", message: "Route not found" }
});
}

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
const message = err instanceof Error ? err.message : "Internal server error";
res.status(500).json({
success: false,
error: { code: "INTERNAL_ERROR", message }
});
}
