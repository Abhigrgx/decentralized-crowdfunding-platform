import rateLimit from "express-rate-limit";
export const uploadRateLimit = rateLimit({
windowMs: 15 * 60 * 1000,
max: 40,
standardHeaders: true,
legacyHeaders: false,
message: {
success: false,
error: { code: "RATE_LIMITED", message: "Too many upload requests" }
}
});