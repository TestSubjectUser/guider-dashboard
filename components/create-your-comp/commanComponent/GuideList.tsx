import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "../utils/firebaseConfig";
import { collection, getDocs, query } from "firebase/firestore";

function GuideList() {
  const [guides, setGuides] = useState<any[]>([]);
  const [isLoadingGuides, setIsLoadingGuides] = useState(true);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const q = query(collection(db, "guides"));
        const snapshot = await getDocs(q);
        setGuides(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching guides:", error);
      } finally {
        setIsLoadingGuides(false);
      }
    };
    fetchGuides();
  }, []);

  return (
    <div className="guide-selection-container">
      <h1>Guides you can Edit</h1>
      {isLoadingGuides ? (
        <p>Loading guides...</p>
      ) : guides.length === 0 ? (
        <p>No guides available</p>
      ) : (
        <div className="guide-list">
          {guides.map((guide) => (
            <Link
              key={guide.id}
              href={`/dashboard?id=${guide.id}`}
              className="guide-card"
            >
              <h3>{guide.guideTitle}</h3>
              <p>{guide.guideDescription}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default GuideList;
