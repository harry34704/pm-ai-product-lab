import { randomUUID } from "node:crypto";
import { DeleteObjectsCommand, GetObjectCommand, HeadBucketCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getObjectStorageConfig, requireObjectStorageConfig } from "./config";

type UploadKind = "resume" | "job";

let storageClient: S3Client | null = null;

function sanitizeFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
}

function getStorageClient() {
  const config = getObjectStorageConfig();

  if (!config) {
    return null;
  }

  if (!storageClient) {
    storageClient = new S3Client({
      region: config.region,
      endpoint: config.endpoint,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey
      },
      forcePathStyle: config.forcePathStyle
    });
  }

  return { client: storageClient, config };
}

function buildObjectUrl(publicBaseUrl: string | undefined, key: string) {
  if (!publicBaseUrl) {
    return null;
  }

  const base = publicBaseUrl.endsWith("/") ? publicBaseUrl : `${publicBaseUrl}/`;
  return new URL(key, base).toString();
}

function toBuffer(chunk: unknown) {
  if (chunk instanceof Uint8Array) {
    return Buffer.from(chunk);
  }

  if (typeof chunk === "string") {
    return Buffer.from(chunk);
  }

  return Buffer.alloc(0);
}

export function objectStorageEnabled() {
  return Boolean(getObjectStorageConfig());
}

export async function createPresignedUpload(input: {
  kind: UploadKind;
  userId: string;
  fileName: string;
  mimeType: string;
}) {
  const storage = getStorageClient();
  if (!storage) {
    return null;
  }

  const { client } = storage;
  const config = requireObjectStorageConfig();
  const key = `${input.kind}/${input.userId}/${Date.now()}-${randomUUID()}-${sanitizeFileName(input.fileName) || "upload.bin"}`;
  const command = new PutObjectCommand({
    Bucket: config.bucket,
    Key: key,
    ContentType: input.mimeType,
    Metadata: {
      uploadedBy: input.userId,
      kind: input.kind
    }
  });

  const url = await getSignedUrl(client, command, {
    expiresIn: config.presignTtlSeconds
  });

  return {
    key,
    url,
    method: "PUT" as const,
    headers: {
      "Content-Type": input.mimeType
    },
    storageProvider: config.provider,
    storageBucket: config.bucket,
    storageUrl: buildObjectUrl(config.publicBaseUrl, key)
  };
}

export async function downloadStoredObject(key: string) {
  const storage = getStorageClient();
  if (!storage) {
    throw new Error("Object storage is not configured.");
  }

  const { client } = storage;
  const config = requireObjectStorageConfig();
  const response = await client.send(
    new GetObjectCommand({
      Bucket: config.bucket,
      Key: key
    })
  );

  const chunks: Buffer[] = [];
  for await (const chunk of response.Body as AsyncIterable<unknown>) {
    chunks.push(toBuffer(chunk));
  }

  return {
    buffer: Buffer.concat(chunks),
    storageProvider: config.provider,
    storageBucket: config.bucket,
    storageUrl: buildObjectUrl(config.publicBaseUrl, key)
  };
}

export async function deleteStoredObjects(keys: string[]) {
  const storage = getStorageClient();
  const uniqueKeys = Array.from(new Set(keys.filter(Boolean)));

  if (!storage || !uniqueKeys.length) {
    return;
  }

  const { client } = storage;
  const config = requireObjectStorageConfig();
  await client.send(
    new DeleteObjectsCommand({
      Bucket: config.bucket,
      Delete: {
        Objects: uniqueKeys.map((Key) => ({ Key }))
      }
    })
  );
}

export async function getObjectStorageHealth() {
  const storage = getStorageClient();

  if (!storage) {
    return {
      configured: false,
      detail: "Object storage is not configured."
    };
  }

  const { client } = storage;
  const config = requireObjectStorageConfig();

  try {
    await client.send(
      new HeadBucketCommand({
        Bucket: config.bucket
      })
    );

    return {
      configured: true,
      detail: `Connected to ${config.provider} bucket ${config.bucket}.`
    };
  } catch (error) {
    return {
      configured: true,
      detail: error instanceof Error ? error.message : "Object storage health check failed."
    };
  }
}
