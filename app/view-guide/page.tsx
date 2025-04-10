import SCSS from "./guide.module.scss";
import GuideContent from "./GuideContent";
import { doc, getDoc } from "firebase/firestore";
import GuideAvailableDocs from "./GuideAvailableDocs";
import {
  GuideDataImagesProps,
  GuideDataProps,
} from "@/components/create-your-comp/utils/types";
import { db } from "../../components/create-your-comp/utils/firebaseConfig";

type RawGuideData = {
  guideTitle?: string;
  guideDescription?: string;
  guideImages?: GuideDataImagesProps;
  timestamp: { seconds: number; nanoseconds: number } | string;
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  let { id } = await searchParams;
  if (Array.isArray(id)) id = id[0];

  if (!id) {
    return <GuideAvailableDocs />;
  }

  try {
    const docRef = doc(db, "guides", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return <div className={SCSS.container}>Guide not found</div>;
    }

    const rawData = docSnap.data() as RawGuideData;

    const timestamp =
      typeof rawData.timestamp === "object" && "seconds" in rawData.timestamp
        ? new Date(rawData.timestamp.seconds * 1000).toDateString()
        : typeof rawData.timestamp === "string"
        ? rawData.timestamp
        : new Date().toDateString();

    const sanitizedData: GuideDataProps = {
      guideTitle: rawData.guideTitle ?? "Untitled",
      guideDescription: rawData.guideDescription ?? "",
      guideImages: rawData.guideImages ?? [],
      timestamp,
    };

    return <GuideContent data={sanitizedData} />;
  } catch (error) {
    return <div className={SCSS.container}>Error loading guide</div>;
  }
}
