import SCSS from "./guide.module.scss";
import GuideContent from "./GuideContent";
import { doc, getDoc } from "firebase/firestore";
import GuideAvailableDocs from "./GuideAvailableDocs";
import { GuideDataProps } from "@/components/create-your-comp/utils/types";
import { db } from "../../components/create-your-comp/utils/firebaseConfig";

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
    const data = docSnap.exists() ? (docSnap.data() as GuideDataProps) : null;

    if (!data) {
      return <div className={SCSS.container}>Guide not found</div>;
    }
    const sanitizedData = {
      ...data,
      timestamp:
        data.timestamp instanceof Date
          ? data.timestamp
          : new Date(data.timestamp),
    };

    return <GuideContent data={sanitizedData} />;
  } catch (error) {
    return <div className={SCSS.container}>Error loading guide</div>;
  }
}
