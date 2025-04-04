import { NextResponse } from "next/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { uploadImageToS3 } from "./s3Upload";
import s3Client from "../../../components/create-your-comp/utils/aws";

export async function POST(req: Request) {
  try {
    const { base64Image } = await req.json();

    if (!base64Image) {
      return NextResponse.json(
        { error: "Image data is missing" },
        { status: 400 }
      );
    }

    const uploadedImageUrl = await uploadImageToS3(base64Image);

    return NextResponse.json({ imageUrl: uploadedImageUrl }, { status: 200 });
  } catch (error) {
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

    const key = imageUrl.split(".amazonaws.com/")[1];

    if (!key) {
      return NextResponse.json(
        { error: "Invalid image URL format" },
        { status: 400 }
      );
    }
    const deleteParams = {
      Bucket: "guider-extension",
      Key: key,
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
    return NextResponse.json(
      { error: "Failed to delete image from S3", message: error },
      { status: 500 }
    );
  }
}
