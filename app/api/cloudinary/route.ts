import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

// Cloudinary Configuration
cloudinary.config({
  cloud_name: "dkb0s3cm8",
  api_key: "771396424836289",
  api_secret: "jB5pbaRH4S-UkLXXhGiMVsjM5Y4",
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

    const result = await cloudinary.uploader.upload(base64Image, {
      folder: "guide-screenshots",
      resource_type: "image",
    });

    return NextResponse.json({ imageUrl: result.secure_url }, { status: 200 });
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

    // console.log("imageUrl", imageUrl);

    const publicurl = imageUrl.split("/upload/")[1].split(".")[0].split("/");
    const publicId = publicurl[1] + "/" + publicurl[2];
    console.log("publicId", publicId);
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok") {
      throw new Error("Cloudinary image deletion failed");
    }

    return NextResponse.json(
      { message: "Image deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
