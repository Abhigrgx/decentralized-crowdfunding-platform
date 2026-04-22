import { Router } from "express";
import multer from "multer";
import { env } from "../config/env.js";
import { uploadRateLimit } from "../middleware/rateLimit.middleware.js";
import { uploadToPinata } from "../services/pinata.service.js";
const upload = multer({
storage: multer.memoryStorage(),
limits: { fileSize: env.uploadMaxMb * 1024 * 1024 },
fileFilter: (_req, file, cb) => {
if (!file.mimetype.startsWith("image/")) {
cb(new Error("Only image uploads are allowed"));
return;
}
cb(null, true);
}
});

export const uploadRouter = Router();

uploadRouter.post("/pinata", uploadRateLimit, upload.single("file"), async (req, res, next) => {
try {
if (!req.file) {
return res.status(400).json({
success: false,
error: { code: "NO_FILE", message: "File is required under form field: file" }
});
}
const result = await uploadToPinata(req.file.buffer, req.file.originalname, req.file.mimetype);
res.json({ success: true, data: result });
} catch (err) {
next(err);
}
});