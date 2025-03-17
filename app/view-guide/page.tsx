"use client";
import "./guide-style.css";
import { doc, getDoc } from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import { db } from "../../app/api/save-screenshot/firebaseConfig";

function GuideContent({ id }: { id: string | null }) {
  const [data, setData] = useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const docRef = doc(db, "guides", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setData(docSnap.data());
        } else {
          console.warn(`Document with ID ${id} not found.`);
        }
      } else {
        console.warn("id is null.");
      }
    };
    fetchData();
  }, [id]);

  return (
    <div className="container">
      <h1 className="guide-title">{data.guideTitle}</h1>
      <p className="guide-description">{data.guideDescription}</p>
      {data.guideImages?.map((image: any, index: number) => (
        <div key={index} className="step-container">
          <div className="title-index">
            <p className="image-index">{index + 1}</p>
            <p className="image-title">{image.title}</p>
          </div>
          <p className="image-description">{image.description}</p>
          <div className="image-wrapper" style={{ position: "relative" }}>
            <div className="step-image">
              <img src={image.screenshotUrl} alt={image.title} />
              <div
                className="bubble"
                style={{
                  position: "absolute",
                  top: `${image.relativeCoordinates.y}%`,
                  left: `${image.relativeCoordinates.x}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function GuidePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GuidePageWrapper />
    </Suspense>
  );
}

function GuidePageWrapper() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  return <GuideContent id={id} />;
}

export default GuidePage;

// suspence warning
// "use client";
// import "./guide-style.css";
// import { doc, getDoc } from "firebase/firestore";
// import { useSearchParams } from "next/navigation";
// import React, { Suspense, useEffect, useRef, useState } from "react";
// import { db } from "../../app/api/save-screenshot/firebaseConfig";

// function page() {
//   const searchParams = useSearchParams();
//   const id = searchParams.get("id");
//   const [data, setData] = useState<any>({});

//   useEffect(() => {
//     const fetchData = async () => {
//       if (id) {
//         const docRef = doc(db, "guides", id);
//         const docSnap = await getDoc(docRef);

//         if (docSnap.exists()) {
//           setData(docSnap.data());
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
//     <Suspense fallback={<div>Loading...</div>}>
//       <div className="container">
//         <h1 className="guide-title">{data.guideTitle}</h1>
//         <p className="guide-description">{data.guideDescription}</p>
//         {data.guideImages?.map((image: any, index: number) => {
//           return (
//             <div key={index} className="step-container">
//               <div className="title-index">
//                 <p className="image-index">{index + 1}</p>
//                 <p className="image-title">{image.title}</p>
//               </div>
//               <p className="image-description">{image.description}</p>
//               <div className="image-wrapper" style={{ position: "relative" }}>
//                 <div className="step-image">
//                   <img src={image.screenshotUrl} alt={image.title} />
//                   <div
//                     className="bubble"
//                     style={{
//                       position: "absolute",
//                       top: `${image.relativeCoordinates.y}%`,
//                       left: `${image.relativeCoordinates.x}%`,
//                     }}
//                   ></div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </Suspense>
//   );
// }

// export default page;
