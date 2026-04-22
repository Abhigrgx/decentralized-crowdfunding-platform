import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod";
export function validate(schema: ZodTypeAny, source: "body" | "params" | "query" = "body") {
return (req: Request, res: Response, next: NextFunction) => {
const parsed = schema.safeParse(req[source]);
if (!parsed.success) {
return res.status(400).json({
success: false,
error: {
code: "VALIDATION_ERROR",
message: "Invalid request",
details: parsed.error.flatten()
}
});
}
(req as any)[source] = parsed.data;
next();
};
}