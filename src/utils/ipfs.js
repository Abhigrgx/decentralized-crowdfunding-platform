/**
 * Convert any IPFS CID or gateway URL to a public ipfs.io gateway URL.
 * Handles: raw CID, https://<gateway>/ipfs/<CID>, ipfs://<CID>
 */
export function toPublicGatewayUrl(cid) {
  if (!cid) return null;
  // Already a gateway URL — extract the CID portion after /ipfs/
  const match = cid.match(/\/ipfs\/([^/?#]+)/);
  if (match) return `https://ipfs.io/ipfs/${match[1]}`;
  // ipfs:// scheme
  if (cid.startsWith("ipfs://")) return `https://ipfs.io/ipfs/${cid.slice(7)}`;
  // Assume raw CID
  return `https://ipfs.io/ipfs/${cid}`;
}
