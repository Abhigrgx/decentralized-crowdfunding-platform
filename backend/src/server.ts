import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./lib/logger.js";
import { prisma } from "./db/prisma.js";
const app = createApp();

const server = app.listen(env.port, () => {
logger.info({ port: env.port }, "Backend started");
});

process.on("SIGTERM", async () => {
logger.info("SIGTERM received. Shutting down...");
server.close(async () => {
await prisma.$disconnect();
process.exit(0);
});
});

process.on("SIGINT", async () => {
logger.info("SIGINT received. Shutting down...");
server.close(async () => {
await prisma.$disconnect();
process.exit(0);
});
});