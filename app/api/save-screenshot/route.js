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

    const savedDocs = [];

    for (const item of body) {
      const { title, relativeCoordinates, screenshotUrl } = item;

      if (!screenshotUrl) {
        console.warn("missing screenshot:", item);
        continue;
      }

      const docRef = await addDoc(collection(db, "screenshots"), {
        title,
        relativeCoordinates,
        screenshotUrl,
        timestamp: new Date(),
      });

      savedDocs.push({ id: docRef.id });
      console.log("Saved document ID:", docRef.id);
    }
    // console.log("Data stored in Firestore:", savedDocs);
    const url = `/dashboard?${savedDocs
      .map((item) => "screenshotIds[]=" + item.id)
      .join("&")}`;
    console.log("url: ", url);

    return NextResponse.json(
      {
        message: "Screenshot saved successfully",
        refids: savedDocs,
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
