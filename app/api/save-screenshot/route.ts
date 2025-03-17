import { NextResponse } from "next/server";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { uploadImageToCloudinary } from "./cloudinaryUpload";

interface RelativeCoordinates {
  x: number;
  y: number;
}

interface GuideImage {
  title: string;
  description: string;
  relativeCoordinates: RelativeCoordinates;
  screenshotUrl: string;
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
  screenshotUrl: string;
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
    // const guideImages: GuideImage[] = body
    //   .slice(0, -1)
    //   .map(({ title, relativeCoordinates, screenshotUrl }) => ({
    //     title,
    //     description: "",
    //     relativeCoordinates,
    //     screenshotUrl,
    //   }));

    const guideImages: GuideImage[] = await Promise.all(
      body
        .slice(0, -1)
        .map(async ({ title, relativeCoordinates, screenshotUrl }) => {
          try {
            console.log("Uploading image to Cloudinary...");
            const cloudinaryUrl = await uploadImageToCloudinary(screenshotUrl);
            console.log("Image uploaded:", cloudinaryUrl);

            return {
              title,
              description: "",
              relativeCoordinates,
              // Store Cloudinary URL, not base64
              screenshotUrl: cloudinaryUrl,
            };
          } catch (error) {
            console.error("Image upload failed:", error);
            throw new Error("Failed to upload image to Cloudinary");
          }
        })
    );
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

// Current - in screenshot collection each document carries
/*
 * relativeCoordinates: {x: 50, y: 50}
 * screenshotUrl: "data:image/png;base64,iVBORw0KGgoA..."
 * timestamp: 10 March 2025 at 13:34:27 UTC+5:30
 * title: "Clicked on button"
 */

// Updated - return document id only
// document carries
/*
 * guideTitle: "title of the guide"
 * guideDescription: "description of the guide"
 * guideImages: [title: "Clicked on button", description: "description", relativeCoordinates: {x: 50, y: 50}, screenshotUrl: "data:image/png;base64,iVBORw0KGgoA..."]
 */
