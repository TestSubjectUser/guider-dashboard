import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "./aws";

// Upload image to S3
export const uploadImageToS3 = async (base64Image: string) => {
  try {
    const buffer = Buffer.from(base64Image.split(",")[1], "base64");
    const params = {
      Bucket: "guider-extension",
      Key: `guide-screenshots/${Date.now()}.png`,
      Body: buffer,
      ContentEncoding: "base64",
      ContentType: "image/jpeg",
    };

    const command = new PutObjectCommand(params);
    const sendResp = await s3Client.send(command);
    if (sendResp.$metadata.httpStatusCode === 200)
      return `https://${params.Bucket}.s3.eu-north-1.amazonaws.com/${params.Key}`;
    else return "image was not uploaded to S3";
  } catch (error) {
    throw new Error("Failed to upload image to S3, error: " + error);
  }
};
