import { prisma } from "../db/prisma.js";
import { getAllProjects } from "./chain.service.js";
export async function syncProjectsSnapshot() {
const projects = await getAllProjects();

for (const p of projects) {
await prisma.projectSnapshot.upsert({
where: { id: p.id },
update: {
projectName: p.projectName,
projectDescription: p.projectDescription,
creatorName: p.creatorName,
cid: p.cid,
fundingGoalWei: p.fundingGoal,
amountRaisedWei: p.amountRaised,
totalContributors: p.totalContributors,
creationTime: BigInt(p.creationTime),
durationSeconds: BigInt(p.duration),
category: p.category
},
create: {
id: p.id,
projectName: p.projectName,
projectDescription: p.projectDescription,
creatorName: p.creatorName,
cid: p.cid,
fundingGoalWei: p.fundingGoal,
amountRaisedWei: p.amountRaised,
totalContributors: p.totalContributors,
creationTime: BigInt(p.creationTime),
durationSeconds: BigInt(p.duration),
category: p.category
}
});
}

await prisma.syncState.upsert({
where: { key: "projects_last_sync" },
update: { value: String(Date.now()) },
create: { key: "projects_last_sync", value: String(Date.now()) }
});

return { count: projects.length };
}