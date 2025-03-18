import { v2 as cloudinary } from "cloudinary";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { uploadImageToS3 } from "../save-screenshot/s3Upload";

const s3Client = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: "AKIAYS2NVH7EDTOAGAWU",
    secretAccessKey: "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",
  },
});

export async function POST(req: Request) {
  try {
    const { base64Image } = await req.json();

    if (!base64Image) {
      return NextResponse.json(
        { error: "Image data is missing" },
        { status: 400 }
      );
    }

    // const result = await cloudinary.uploader.upload(base64Image, {
    //   folder: "guide-screenshots",
    //   resource_type: "image",
    // });
    const uploadedImageUrl = await uploadImageToS3(base64Image);

    return NextResponse.json({ imageUrl: uploadedImageUrl }, { status: 200 });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is missing" },
        { status: 400 }
      );
    }

    // Extract the S3 key from the image URL
    const key = imageUrl.split(".amazonaws.com/")[1]; // This assumes your URL format is something like: https://bucket-name.s3.region.amazonaws.com/key
    console.log("aws image key", key);

    if (!key) {
      return NextResponse.json(
        { error: "Invalid image URL format" },
        { status: 400 }
      );
    }

    // Delete the image from S3
    const deleteParams = {
      Bucket: "guider-extension",
      Key: key, // The key/path of the object in the S3 bucket
    };

    const command = new DeleteObjectCommand(deleteParams);

    const result = await s3Client.send(command);

    if (result.$metadata.httpStatusCode !== 204) {
      throw new Error("Failed to delete image from S3");
    }

    return NextResponse.json(
      { message: "Image deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting image from S3:", error);
    return NextResponse.json(
      { error: "Failed to delete image from S3", message: error },
      { status: 500 }
    );
  }
}
