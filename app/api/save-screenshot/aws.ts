import { S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: "AKIAYS2NVH7EDTOAGAWU",
    secretAccessKey: "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",
  },
});

export default s3Client;

// guider-extension - name of the bucket

// AWS Region
// Europe (Stockholm) eu-north-1

// guider-extension-user - IAM user name

// access key - AKIAYS2NVH7EDTOAGAWU
// secret access key - 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
