import { S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: "AKIAYS2NVH7EDTOAGAWU",
    secretAccessKey: "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",
  },
});

export default s3Client;
