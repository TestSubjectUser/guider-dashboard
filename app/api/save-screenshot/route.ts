import { NextResponse } from "next/server";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { uploadImageToS3 } from "./s3Upload";
import {
  GuideDataImagesProps,
  GuideDataProps,
  RequestBody,
} from "@/components/create-your-comp/types";

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body: RequestBody[] = await req.json();

    if (body.length === 0) {
      return NextResponse.json(
        { error: "Invalid data format, nothing received." },
        { status: 400 }
      );
    }

    const guideTitle: string = "Guide - Guide Creator";
    const guideDescription: string = "";
    const guideImages: GuideDataImagesProps = [];

    for (const {
      title,
      relativeCoordinates,
      screenshotUrl,
      description = "",
      tabTitle = "undefined",
    } of body) {
      if (screenshotUrl) {
        const uploadedImageUrl = await uploadImageToS3(screenshotUrl);
        guideImages.push({
          title,
          description,
          relativeCoordinates,
          screenshotUrl: uploadedImageUrl,
          scale: 1.4,
          tabTitle,
        });
      } else {
        guideImages.push({
          title,
          description,
          relativeCoordinates: null,
          screenshotUrl: null,
          scale: 1.4,
          tabTitle,
        });
      }
    }

    let docRef;
    try {
      docRef = await addDoc(collection(db, "guides"), {
        guideTitle,
        guideDescription,
        guideImages,
        timestamp: new Date(),
      } as GuideDataProps);
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

    const url = `/dashboard?id=${docRef.id}`;

    return NextResponse.json(
      {
        message: "Screenshot saved successfully",
        refids: docRef.id,
        urlToVists: url,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error saving screenshot", message: error.message },
      { status: 500 }
    );
  }
}
