import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();

const EnvSchema = z.object({
PORT: z.string().default("8080"),
NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
CORS_ORIGIN: z.string().default("http://localhost:3000"),
DATABASE_URL: z.string().min(1),
AVALANCHE_RPC_URL: z.string().url(),
CONTRACT_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
PINATA_JWT: z.string().min(1),
UPLOAD_MAX_MB: z.string().default("8")
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
process.exit(1);
}

export const env = {
port: Number(parsed.data.PORT),
nodeEnv: parsed.data.NODE_ENV,
corsOrigin: parsed.data.CORS_ORIGIN,
databaseUrl: parsed.data.DATABASE_URL,
avalancheRpcUrl: parsed.data.AVALANCHE_RPC_URL,
contractAddress: parsed.data.CONTRACT_ADDRESS,
pinataJwt: parsed.data.PINATA_JWT,
uploadMaxMb: Number(parsed.data.UPLOAD_MAX_MB)
};