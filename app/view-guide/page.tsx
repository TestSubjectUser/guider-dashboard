import styles from "./guide.module.css";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../app/api/save-screenshot/firebaseConfig";
import { GuideDataProps } from "@/components/create-your-comp/types";
import GuideContent from "./GuideContent";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  let { id } = await searchParams;
  if (Array.isArray(id)) id = id[0];

  if (!id) {
    return <div className={styles.container}>No guide ID provided</div>;
  }

  try {
    const docRef = doc(db, "guides", id);
    const docSnap = await getDoc(docRef);
    const data = docSnap.exists() ? (docSnap.data() as GuideDataProps) : null;

    if (!data) {
      return <div className={styles.container}>Guide not found</div>;
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
    return <div className={styles.container}>Error loading guide</div>;
  }
}
