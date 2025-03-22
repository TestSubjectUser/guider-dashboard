// made this component server side renderable.
import styles from "./guide.module.css";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../app/api/save-screenshot/firebaseConfig";
import { GuideDataProps } from "@/components/create-your-comp/types";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  let { id } = await searchParams;
  if (Array.isArray(id)) {
    id = id[0];
  }
  // console.log("id: ", id);
  // console.log(typeof id);

  if (!id) {
    return <div className={styles.container}>No guide ID provided</div>;
  }

  let data: GuideDataProps | null = null;
  try {
    const docRef = doc(db, "guides", id);
    const docSnap = await getDoc(docRef);
    data = docSnap.exists() ? (docSnap.data() as GuideDataProps) : null;
  } catch (error) {
    console.error("Error fetching guide:", error);
    return <div className={styles.container}>Error loading guide</div>;
  }

  if (!data) {
    return <div className={styles.container}>Guide not found</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.guideTitle}>{data.guideTitle}</h1>
      <p className={styles.guideDescription}>{data.guideDescription}</p>
      <div className={styles.stepsContainer}>
        {data.guideImages?.map((image, index) => (
          <div key={index} className={styles.stepContainer}>
            <div className={styles.titleIndex}>
              <p className={styles.imageIndex}>{index + 1}</p>
              <p className={styles.imageTitle}>{image.title}</p>
            </div>
            <p className={styles.imageDescription}>{image.description}</p>
            {image.screenshotUrl && (
              <div
                className={styles.imageWrapper}
                style={{ position: "relative" }}
              >
                <div className={styles.stepImage}>
                  <img
                    src={image.screenshotUrl}
                    alt={image.title}
                    style={{
                      maxWidth: "75vw",
                      objectFit: "contain",
                      maxHeight: "450px",
                      transition: "transform 0.5s ease-out",
                      transform: `scale(${image.scale ?? 1})`,
                      transformOrigin: `${image?.relativeCoordinates?.x}% ${image?.relativeCoordinates?.y}%`,
                      position: "relative",
                    }}
                  />
                  {image.relativeCoordinates && (
                    <div
                      className={styles.bubble}
                      style={{
                        position: "absolute",
                        top: `${image.relativeCoordinates.y}%`,
                        left: `${image.relativeCoordinates.x}%`,
                      }}
                    ></div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
// "use client";
// import styles from "./guide.module.css";
// import { doc, getDoc } from "firebase/firestore";
// import { useSearchParams } from "next/navigation";
// import React, { Suspense, useEffect, useState } from "react";
// import { db } from "../../app/api/save-screenshot/firebaseConfig";
// import { GuideDataProps } from "@/components/create-your-comp/types";

// const GuideContent = () => {
//   const searchParams = useSearchParams();
//   const id = searchParams.get("id");

//   const [data, setData] = useState<GuideDataProps>({
//     guideTitle: "",
//     guideDescription: "",
//     guideImages: [],
//     timestamp: new Date(),
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       if (id) {
//         const docRef = doc(db, "guides", id);
//         const docSnap = await getDoc(docRef);

//         if (docSnap.exists()) {
//           setData(docSnap.data() as GuideDataProps);
//         } else {
//           console.warn(`Document with ID ${id} not found.`);
//         }
//       } else {
//         console.warn("id is null.");
//       }
//     };
//     fetchData();
//   }, [id]);

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.guideTitle}>{data.guideTitle}</h1>
//       <p className={styles.guideDescription}>{data.guideDescription}</p>
//       {data.guideImages?.map((image, index) => (
//         <div key={index} className={styles.stepContainer}>
//           <div className={styles.titleIndex}>
//             <p className={styles.imageIndex}>{index + 1}</p>
//             <p className={styles.imageTitle}>{image.title}</p>
//           </div>
//           <p className={styles.imageDescription}>{image.description}</p>
//           <div className={styles.imageWrapper} style={{ position: "relative" }}>
//             <div className={styles.stepImage}>
//               <img
//                 src={image.screenshotUrl}
//                 alt={image.title}
//                 style={{
//                   maxWidth: "75vw",
//                   objectFit: "contain",
//                   maxHeight: "450px",
//                 }}
//               />
//               <div
//                 className={styles.bubble}
//                 style={{
//                   position: "absolute",
//                   top: `${image.relativeCoordinates.y}%`,
//                   left: `${image.relativeCoordinates.x}%`,
//                 }}
//               ></div>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// function Page() {
//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <GuideContent />
//     </Suspense>
//   );
// }

// export default Page;
