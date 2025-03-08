"use client";
import { useEffect, useRef, useState } from "react";
import { Sidebar } from "./Sidebar";
// import { data as guideData } from "../../app/data";
import Header from "./Header";
import GuideInfo from "./GuideInfo";
import Step from "./Step";
import { db } from "../../app/api/save-screenshot/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const screenshotIds: any = [
  "cTejWKDik7SE6r66B80a",
  "GuC6SqMGxr7vnOH761Eq",
  "nbgmoPY9Wn2vhaQ5fsGI",
  "K7vI1esEApOvbqTahYuB",
];

const CreateComponent = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [stepsData, setStepsData] = useState<any[]>([]);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await Promise.all(
        screenshotIds.map(async (id: string) => {
          const docRef = doc(db, "screenshots", id);
          const docins = await getDoc(docRef);

          if (docins.exists()) {
            return { id, ...docins.data() };
          } else {
            console.warn(`Document with ID ${id} 404`);
            return null;
          }
        })
      );

      setStepsData(fetchedData.filter((data) => data !== null));
    };

    fetchData();
  }, []);

  useEffect(() => {
    imageRefs.current = imageRefs.current.slice(0, stepsData.length);
    // console.log("imageRefs.current", imageRefs.current[0]?.complete);
  }, []);

  const handleStepClick = (index: number) => {
    setActiveStep(index);
  };

  return (
    <div className="container">
      <Sidebar
        activeStep={activeStep}
        handleStepClick={handleStepClick}
        stepsData={stepsData}
      />
      <div className="main-content">
        <Header />
        <GuideInfo />
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
