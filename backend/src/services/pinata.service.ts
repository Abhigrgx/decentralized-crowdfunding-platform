import FormData from "form-data";
import fetch from "node-fetch";
import { env } from "../config/env.js";
export async function uploadToPinata(fileBuffer: Buffer, originalName: string, mimeType: string) {
const form = new FormData();
form.append("file", fileBuffer, { filename: originalName, contentType: mimeType });

const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
method: "POST",
headers: {
Authorization: "Bearer " + env.pinataJwt
},
body: form as any
});

if (!res.ok) {
const text = await res.text();
throw new Error("Pinata upload failed: " + text);
}

const data = (await res.json()) as { IpfsHash: string };
const cid = data.IpfsHash;
return {
cid,
gatewayUrl: "https://gateway.pinata.cloud/ipfs/" + cid
};
}