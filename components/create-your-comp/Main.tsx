"use client";
import { useEffect, useRef, useState } from "react";
import { Sidebar } from "./Sidebar";
import Step from "./Step";
import { db } from "../../app/api/save-screenshot/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import EditableHeader from "./EditableHeader";

const CreateComponent = () => {
  const searchParams = useSearchParams();
  const screenshotId = searchParams.get("screenshotId");

  const [activeStep, setActiveStep] = useState(0);
  const [stepsData, setStepsData] = useState<any[]>([]);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  // Editable states
  const [guideTitle, setGuideTitle] = useState("");
  const [guideDescription, setGuideDescription] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "guides", screenshotId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setGuideTitle(docSnap.data()?.guideTitle);
        setGuideDescription(docSnap.data()?.guideDescription);
        setStepsData(docSnap.data().guideImages);
      } else {
        console.warn(`Document with ID ${screenshotId} not found.`);
      }
    };

    fetchData();
  }, [screenshotId]);

  useEffect(() => {
    imageRefs.current = imageRefs.current.slice(0, stepsData.length);
  }, [stepsData]);
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      const index = parseInt(hash, 10);
      scrollToStep(index);
    }
  }, []);
  const scrollToStep = (index: number) => {
    const stepElement = document.getElementById(index.toString());
    if (stepElement) {
      stepElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleStepClick = (index: number) => {
    setActiveStep(index);
  };

  // Save title to Firestore
  const saveTitle = async () => {
    setIsEditingTitle(false);
    // if (screenshotId) {
    //   const docRef = doc(db, "guides", screenshotId);
    //   await updateDoc(docRef, { guideTitle });
    // }
  };

  // Save description to Firestore
  const saveDescription = async () => {
    setIsEditingDescription(false);
    // if (screenshotId) {
    //   const docRef = doc(db, "guides", screenshotId);
    //   await updateDoc(docRef, { guideDescription });
    // }
  };

  //   const updateStep = (index: number, newTitle: string, newDescription: string) => {
  //   const updatedSteps = [...stepsData];
  //   updatedSteps[index] = { ...updatedSteps[index], title: newTitle, description: newDescription };
  //   setStepsData(updatedSteps);
  // };

  const handleGuidetitleordescPublish = async () => {
    if (!screenshotId) return;

    const docRef = doc(db, "guides", screenshotId);
    await updateDoc(docRef, {
      guideTitle,
      guideDescription,
    });

    alert("Guide updated successfully!");
  };

  return (
    <div className="container">
      <Sidebar
        activeStep={activeStep}
        handleStepClick={handleStepClick}
        stepsData={stepsData}
      />
      <div className="main-content">
        <div className="header">
          <button className="exit-button"></button>
          <div className="header-buttons">
            <button
              className="publish-button"
              onClick={handleGuidetitleordescPublish}
            >
              Publish and share
            </button>
          </div>
        </div>

        {/* Guide Title */}
        <div className="guide-info">
          <EditableHeader
            textValue={guideTitle}
            textColor=""
            textSize="1.5rem"
          />
          <EditableHeader
            textValue={guideDescription}
            textColor="#2563eb"
            textSize="1.25rem"
          />
          <div>{/* <EditableHeader /> */}</div>
        </div>

        {/* Steps */}
        <div className="steps">
          {stepsData.map((step, index) => (
            <Step key={index} step={step} index={index} imageRefs={imageRefs} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateComponent;

// "use client";
// import { useEffect, useRef, useState } from "react";
// import { Sidebar } from "./Sidebar";
// // import { data as guideData } from "../../app/data";
// // import Header from "./Header";
// // import GuideInfo from "./GuideInfo";
// import Step from "./Step";
// import { db } from "../../app/api/save-screenshot/firebaseConfig";
// import { doc, getDoc } from "firebase/firestore";
// import { useSearchParams } from "next/navigation";

// // const screenshotId: any = [
// //   "cTejWKDik7SE6r66B80a",
// //   "GuC6SqMGxr7vnOH761Eq",
// //   "nbgmoPY9Wn2vhaQ5fsGI",
// //   "K7vI1esEApOvbqTahYuB",
// // ];

// const CreateComponent = () => {
//   const searchParams = useSearchParams();
//   const screenshotId = searchParams.get("screenshotId");
//   // console.log("search", search);

//   const [activeStep, setActiveStep] = useState(0);
//   const [stepsData, setStepsData] = useState<any[]>([]);
//   const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
//   const [guideTitle, setGuideTitle] = useState("");
//   const [guideDescription, setGuideDescription] = useState("");

//   useEffect(() => {
//     const fetchData = async () => {
//       const docRef = doc(db, "guides", screenshotId);
//       const docins = await getDoc(docRef);
//       setGuideTitle(docins.data()?.guideTitle);
//       setGuideDescription(docins.data()?.guideDescription);
//       if (docins.exists()) {
//         setStepsData(docins.data().guideImages);
//       } else {
//         console.warn(`Document with ID ${screenshotId} 404`);
//         return null;
//       }
//       // const fetchedData = await Promise.all(
//       //   screenshotId.map(async (id: string) => {
//       //     const docRef = doc(db, "screenshots", id);
//       //     const docins = await getDoc(docRef);

//       //     if (docins.exists()) {
//       //       return { id, ...docins.data() };
//       //     } else {
//       //       console.warn(`Document with ID ${id} 404`);
//       //       return null;
//       //     }
//       //   })
//       // );

//       // setStepsData(fetchedData.filter((data) => data !== null));
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     imageRefs.current = imageRefs.current.slice(0, stepsData.length);
//     // console.log("imageRefs.current", imageRefs.current[0]?.complete);
//   }, []);

//   const handleStepClick = (index: number) => {
//     setActiveStep(index);
//   };

//   return (
//     <div className="container">
//       <Sidebar
//         activeStep={activeStep}
//         handleStepClick={handleStepClick}
//         stepsData={stepsData}
//       />
//       <div className="main-content">
//         {/* <Header /> */}
//         <div className="header">
//           <button className="exit-button"></button>
//           <div className="header-buttons">
//             <button className="publish-button">Publish and share</button>
//           </div>
//         </div>
//         <div className="guide-info">
//           <div className="guide-info-header">
//             <h1>{guideTitle ? guideTitle : "Title of the guide"}</h1>
//             <button className="edit-button">
//               <i className="">edit</i>
//             </button>
//           </div>
//           <div className="guide-info-description">
//             <p>
//               {guideDescription
//                 ? guideDescription
//                 : "What is this guide about?"}
//             </p>
//             <button className="edit-button">
//               <i className="">edit</i>
//             </button>
//           </div>
//         </div>
//         <div className="steps">
//           {stepsData.map((step, index) => (
//             <Step key={index} step={step} index={index} imageRefs={imageRefs} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateComponent;
