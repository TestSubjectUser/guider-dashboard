import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: "AKIAYS2NVH7EDTOAGAWU",
    secretAccessKey: "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",
  },
});
// Upload image to S3
export const uploadImageToS3 = async (base64Image: string) => {
  try {
    const buffer = Buffer.from(base64Image.split(",")[1], "base64");
    const params = {
      Bucket: "guider-extension",
      Key: `guide-screenshots/${Date.now()}.png`, // Customize file extension if needed
      Body: buffer,
      ContentEncoding: "base64",
      ContentType: "image/jpeg", // Adjust content type if needed
    };

    const command = new PutObjectCommand(params);
    const data = await s3Client.send(command);
    return `https://${params.Bucket}.s3.eu-north-1.amazonaws.com/${params.Key}`;
  } catch (error) {
    console.error("S3 Upload Error:", error);
    throw new Error("Failed to upload image to S3");
  }
};

// Delete image from S3
export const deleteImageFromS3 = async (imageUrl: string) => {
  try {
    const key = imageUrl.split(`${process.env.AWS_BUCKET_NAME}/`)[1];
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    };

    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);
    console.log("Image deleted from S3 successfully.");
    return true;
  } catch (error) {
    console.error("S3 Deletion Error:", error);
    return false;
  }
};
