import { Router } from "express";
import { z } from "zod";
import { getAddress } from "ethers";
import { validate } from "../middleware/validate.middleware.js";
import { getAllProjects, getMilestones, getProject, getUserFundings } from "../services/chain.service.js";
import { prisma } from "../db/prisma.js";
import { syncProjectsSnapshot } from "../services/indexer.service.js";
const ProjectIdSchema = z.object({
id: z.coerce.number().int().nonnegative()
});

const AddressSchema = z.object({
address: z.string().min(1)
});

export const projectRouter = Router();

projectRouter.get("/", async (_req, res, next) => {
try {
const projects = await getAllProjects();
res.json({ success: true, data: projects });
} catch (err) {
next(err);
}
});

projectRouter.get("/snapshots", async (_req, res, next) => {
try {
const rows = await prisma.projectSnapshot.findMany({ orderBy: { id: "asc" } });
res.json({ success: true, data: rows });
} catch (err) {
next(err);
}
});

projectRouter.post("/sync", async (_req, res, next) => {
try {
const result = await syncProjectsSnapshot();
res.json({ success: true, data: result });
} catch (err) {
next(err);
}
});

projectRouter.get("/:id", validate(ProjectIdSchema, "params"), async (req, res, next) => {
try {
const { id } = req.params as any;
const project = await getProject(id);
res.json({ success: true, data: project });
} catch (err) {
next(err);
}
});

projectRouter.get("/:id/milestones", validate(ProjectIdSchema, "params"), async (req, res, next) => {
try {
const { id } = req.params as any;
const milestones = await getMilestones(id);
res.json({ success: true, data: milestones });
} catch (err) {
next(err);
}
});

projectRouter.get("/user/:address/fundings", validate(AddressSchema, "params"), async (req, res, next) => {
try {
const { address } = req.params as any;
const normalized = getAddress(address);
const fundings = await getUserFundings(normalized);
res.json({ success: true, data: fundings });
} catch (err) {
next(err);
}
});