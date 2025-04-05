"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/components/create-your-comp/utils/firebaseConfig";

function GuideAvailableDocs() {
  const [guides, setGuides] = useState<any>([]);

  useEffect(() => {
    const fetchGuides = async () => {
      const q = query(collection(db, "guides"));
      const snapshot = await getDocs(q);
      setGuides(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchGuides();
  }, []);

  return (
    <div>
      <h1>Guides you can visit</h1>
      {guides.length === 0
        ? "No guides available"
        : guides.map((guide: any) => (
            <Link key={guide.id} href={`/view-guide?id=${guide.id}`}>
              <h3>{guide.guideTitle}</h3>
              <p>{guide.guideDescription}</p>
            </Link>
          ))}
    </div>
  );
}

export default GuideAvailableDocs;
