import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Receiving request...");
    // console.log("body: ", body);

    const { mouseCoordinates, pageSize, relativeCoordinates, screenshotUrl } =
      body[0];
    console.log("relativeCoordinates: ", JSON.stringify(relativeCoordinates));

    if (!screenshotUrl) {
      return NextResponse.json(
        { error: "No screenshot provided" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Screenshot saved successfully" },
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
