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

  const updateStep = (
    index: number,
    newTitle: string,
    newDescription: string
  ) => {
    const updatedSteps = [...stepsData];
    updatedSteps[index] = {
      ...updatedSteps[index],
      title: newTitle,
      description: newDescription,
    };
    setStepsData(updatedSteps);
  };

  const addStep = (
    index: number,
    newTitle: string,
    newDescription: string,
    screenshotUrl: string,
    relativeCoordinates: { x: number; y: number }
  ) => {
    const updatedSteps = [...stepsData];
    updatedSteps.splice(index, 0, {
      title: newTitle,
      description: newDescription,
      screenshotUrl: screenshotUrl,
      relativeCoordinates: relativeCoordinates,
    });
    setStepsData(updatedSteps);
  };

  // Title, desc, guideImages(title, desc) will be updateeedd
  const handleGuidetitleordescPublish = async () => {
    if (!screenshotId) return;

    try {
      const docRef = doc(db, "guides", screenshotId);
      await updateDoc(docRef, {
        guideTitle,
        guideDescription,
        guideImages: stepsData,
      });
      alert("Guide updated successfully!");
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  return (
    <div className="container">
      <Sidebar
        activeStep={activeStep}
        handleStepClick={handleStepClick}
        stepsData={stepsData}
        imageRefs={imageRefs}
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
            setText={setGuideTitle}
          />
          <EditableHeader
            textValue={guideDescription}
            textColor="#2563eb"
            textSize="1.25rem"
            setText={setGuideDescription}
          />
        </div>

        <div className="steps">
          {stepsData.map((step, index) => (
            <Step
              key={index}
              step={step}
              index={index}
              imageRefs={imageRefs}
              updateStep={updateStep}
              addStep={addStep}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateComponent;
