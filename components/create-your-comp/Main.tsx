"use client";
import { useEffect, useRef, useState } from "react";
import { Sidebar } from "./Sidebar";
import { data as guideData } from "../../app/data";
import Header from "./Header";
import GuideInfo from "./GuideInfo";
import Step from "./Step";

const CreateComponent = () => {
  const [activeStep, setActiveStep] = useState(0);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    imageRefs.current = imageRefs.current.slice(0, guideData.length);
    // console.log("imageRefs.current", imageRefs.current[0]?.complete);
  }, []);

  const handleStepClick = (index: number) => {
    setActiveStep(index); // Update the active step when clicked
  };

  return (
    <div className="container">
      <Sidebar activeStep={activeStep} handleStepClick={handleStepClick} />
      <div className="main-content">
        <Header />
        <GuideInfo />
        <div className="steps">
          {guideData.map((step, index) => (
            <Step key={index} step={step} index={index} imageRefs={imageRefs} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateComponent;
