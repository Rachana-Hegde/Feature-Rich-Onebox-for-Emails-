import { QdrantClient } from "@qdrant/js-client-rest";
import ENV from "./env";

let qdrantClient: QdrantClient | null = null;

export async function getQdrantClientAsync(): Promise<QdrantClient> {
  if (qdrantClient) return qdrantClient;

  const url = ENV.QDRANT_URL;
  const apiKey = ENV.QDRANT_API_KEY;

  qdrantClient = new QdrantClient({ url, apiKey: apiKey ?? undefined });

  (qdrantClient as any).collectionsApi
  .listCollections()
  .then(() => console.info("[qdrant] ✅ Connected to", url))
  .catch((err: any) => console.warn("[qdrant] ⚠️ Connection warning:", err?.message ?? err));

  return qdrantClient;
}