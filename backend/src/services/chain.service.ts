import { Contract, JsonRpcProvider, getAddress } from "ethers";
import { env } from "../config/env.js";
import abi from "../abi/crowdfundingAbi.json" with { type: "json" };

const provider = new JsonRpcProvider(env.avalancheRpcUrl);
const contract = new Contract(env.contractAddress, abi, provider);

export type ProjectMetadataDto = {
id: number;
projectName: string;
projectDescription: string;
creatorName: string;
cid: string;
fundingGoal: string;
amountRaised: string;
totalContributors: number;
creationTime: string;
duration: string;
category: number;
};

export async function getAllProjects(): Promise<ProjectMetadataDto[]> {
const rows = await contract.getAllProjectsDetail();
return rows.map((p: any, idx: number) => ({
id: idx,
projectName: p.projectName,
projectDescription: p.projectDescription,
creatorName: p.creatorName,
cid: p.cid,
fundingGoal: p.fundingGoal.toString(),
amountRaised: p.amountRaised.toString(),
totalContributors: Number(p.totalContributors),
creationTime: p.creationTime.toString(),
duration: p.duration.toString(),
category: Number(p.category)
}));
}

export async function getProject(projectId: number) {
const p = await contract.getProject(projectId);
return {
projectName: p.projectName,
projectDescription: p.projectDescription,
creatorName: p.creatorName,
projectLink: p.projectLink,
cid: p.cid,
fundingGoal: p.fundingGoal.toString(),
duration: p.duration.toString(),
creationTime: p.creationTime.toString(),
amountRaised: p.amountRaised.toString(),
creatorAddress: p.creatorAddress,
category: Number(p.category),
refundPolicy: Number(p.refundPolicy),
contributors: p.contributors,
amount: p.amount.map((x: any) => x.toString()),
refundClaimed: p.refundClaimed,
claimedAmount: p.claimedAmount
};
}

export async function getUserFundings(address: string) {
const normalized = getAddress(address);
const rows = await contract.getUserFundings(normalized);
return rows.map((r: any) => ({
projectIndex: Number(r.projectIndex),
totalAmount: r.totalAmount.toString()
}));
}

export async function getMilestones(projectId: number, maxScan = 200) {
const milestones: Array<{
index: number;
description: string;
amount: string;
approvalVotes: string;
isClaimed: boolean;
}> = [];

for (let i = 0; i < maxScan; i += 1) {
try {
const m = await contract.projectMilestones(projectId, i);
milestones.push({
index: i,
description: m.description,
amount: m.amount.toString(),
approvalVotes: m.approvalVotes.toString(),
isClaimed: m.isClaimed
});
} catch {
break;
}
}
return milestones;
}