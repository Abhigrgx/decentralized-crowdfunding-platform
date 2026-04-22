import { Router } from "express";
export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
res.json({
success: true,
data: {
service: "crowdfunding-backend",
status: "ok",
timestamp: new Date().toISOString()
}
});
});