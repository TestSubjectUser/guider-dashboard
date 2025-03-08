import { NextResponse } from "next/server";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Receiving request...");

    const { mouseCoordinates, pageSize, relativeCoordinates, screenshotUrl } =
      body[0];
    console.log("relativeCoordinates: ", JSON.stringify(relativeCoordinates));
    // console.log("screenshotUrl: ", screenshotUrl);

    if (!screenshotUrl) {
      return NextResponse.json(
        { error: "No screenshot provided" },
        { status: 400 }
      );
    }
    const docRef = await addDoc(collection(db, "screenshots"), {
      relativeCoordinates,
      screenshotUrl,
      timestamp: new Date(),
    });
    console.log("Data stored in Firestore:", docRef.id);

    return NextResponse.json(
      { message: "Screenshot saved successfully", refid: docRef.id },
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
