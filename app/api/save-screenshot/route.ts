import { NextResponse } from "next/server";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { uploadImageToS3 } from "./s3Upload"; // Assuming you have an S3 upload utility

interface RelativeCoordinates {
  x: number;
  y: number;
}
interface GuideImage {
  title: string;
  description: string;
  relativeCoordinates: RelativeCoordinates;
  screenshotUrl: string; // This will be the S3 URL after uploading
}
interface Guide {
  guideTitle: string;
  guideDescription: string;
  guideImages: GuideImage[];
  timestamp: Date;
}
interface RequestBody {
  title: string;
  relativeCoordinates: RelativeCoordinates;
  screenshotUrl: string; // Base64 image data or URL of the image
  urlWeAreOn: string;
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body: RequestBody[] = await req.json();
    console.log("Receiving request...");

    if (body.length === 0) {
      return NextResponse.json(
        { error: "Invalid data format, nothing received." },
        { status: 400 }
      );
    }

    const guideTitle: string = body[body.length - 1].urlWeAreOn;
    console.log("guideTitle: ", guideTitle);

    const guideDescription: string = "";
    const guideImages: GuideImage[] = [];

    for (const { title, relativeCoordinates, screenshotUrl } of body.slice(
      0,
      -1
    )) {
      const uploadedImageUrl = await uploadImageToS3(screenshotUrl);
      guideImages.push({
        title,
        description: "",
        relativeCoordinates,
        screenshotUrl: uploadedImageUrl,
      });
    }

    let docRef;
    try {
      docRef = await addDoc(collection(db, "guides"), {
        guideTitle,
        guideDescription,
        guideImages,
        timestamp: new Date(),
      } as Guide);
    } catch (e: any) {
      if (
        e.code === "invalid-argument" &&
        e.message.includes("exceeds the maximum allowed size")
      ) {
        return NextResponse.json(
          { error: "Document size exceeds 1MB limit." },
          { status: 400 }
        );
      }
      throw e;
    }

    console.log("Guide saved with ID:", docRef.id);
    const url = `/dashboard?screenshotId=${docRef.id}`;

    return NextResponse.json(
      {
        message: "Screenshot saved successfully",
        refids: docRef.id,
        urlToVists: url,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error saving screenshot:", error);
    return NextResponse.json(
      { error: "Error saving screenshot", message: error.message },
      { status: 500 }
    );
  }
}
