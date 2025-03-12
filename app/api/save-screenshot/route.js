import { NextResponse } from "next/server";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Receiving request...");

    if (body.length === 0) {
      return NextResponse.json(
        { error: "Invalid data format, nothing received." },
        { status: 400 }
      );
    }

    // const { relativeCoordinates, screenshotUrl } = body[0];
    // console.log("relativeCoordinates: ", JSON.stringify(relativeCoordinates));
    // console.log("screenshotUrl: ", screenshotUrl);

    const guideTitle = body[body.length - 1].urlWeAreOn;
    console.log("guideTitle: ", guideTitle);

    // const guideTitle = "Guide Title: Default";
    const guideDescription = "Guide Description: Default";
    // console.log("body: ", body[0].urlWeAreOn);
    const guideImages = body
      .slice(0, -1)
      .map(({ title, relativeCoordinates, screenshotUrl }) => ({
        title,
        description: "Description",
        relativeCoordinates,
        screenshotUrl,
      }));

    let docRef;
    try {
      docRef = await addDoc(collection(db, "guides"), {
        guideTitle,
        guideDescription,
        guideImages,
        timestamp: new Date(),
      });
    } catch (e) {
      // console.log("e.code: --- ", e.code);
      // console.log("e.message: --- ", e.message);
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
  } catch (error) {
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
