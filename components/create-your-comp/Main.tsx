"use client";
import { useEffect, useRef, useState } from "react";
import { Sidebar } from "./Sidebar";
import Step from "./Step";
import { db } from "../../app/api/save-screenshot/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import EditableHeader from "./EditableHeader";
import ImageWithBubble from "./ImageWithBubble";
import Popup from "./Popup";

const CreateComponent = () => {
  const searchParams = useSearchParams();
  const screenshotId = searchParams.get("screenshotId");

  const [activeStep, setActiveStep] = useState(0);
  const [stepsData, setStepsData] = useState<any[]>([]);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  // Editable states
  const [guideTitle, setGuideTitle] = useState("");
  const [guideDescription, setGuideDescription] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [popupUrl, setPopupUrl] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      if (screenshotId) {
        const docRef = doc(db, "guides", screenshotId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setGuideTitle(docSnap.data()?.guideTitle);
          setGuideDescription(docSnap.data()?.guideDescription);
          setStepsData(docSnap.data().guideImages);
        } else {
          console.warn(`Document with ID ${screenshotId} not found.`);
        }
      } else {
        console.warn("screenshotId is null.");
      }
    };
    fetchData();
  }, [screenshotId]);

  useEffect(() => {
    imageRefs.current = imageRefs.current.slice(0, stepsData.length);
  }, [stepsData]);

  // const handleStepClick = (index: number) => {
  //   setActiveStep(index);
  // };

  const updateStep = (
    index: number,
    newTitle: string,
    newDescription: string,
    newCoordinates?: { x: number; y: number }
  ) => {
    const updatedSteps = [...stepsData];
    updatedSteps[index] = {
      ...updatedSteps[index],
      title: newTitle,
      description: newDescription,
      relativeCoordinates:
        newCoordinates ?? updatedSteps[index].relativeCoordinates,
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
  const deleteStep = (index: number) => {
    const updatedSteps = [...stepsData];
    updatedSteps.splice(index, 1);
    setStepsData(updatedSteps);
  };
  // Title, desc, guideImages(title, desc) will be updateeedd
  const handleGuidetitleordescPublish = async () => {
    setIsLoading(true);
    if (!screenshotId) return;

    try {
      const docRef = doc(db, "guides", screenshotId);
      await updateDoc(docRef, {
        guideTitle,
        guideDescription,
        guideImages: stepsData,
      });
      // alert("Guide updated successfully!");
      setPopupUrl("http://localhost:3000/view-guide?id=" + screenshotId);
      setShowPopup(true);
    } catch (e) {
      console.error("Error updating document: ", e);
    }
    setIsLoading(false);
  };

  // IntersectionObserver to track the currently visible step
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Set the active step when the entry is in the viewport
            const stepIndex = parseInt(entry.target.id.replace("step-", ""));
            setActiveStep(stepIndex);
          }
        });
      },
      { threshold: 0.5 } // Trigger when 50% of the step is in view
    );

    // Observe each step
    stepsData.forEach((_, index) => {
      const stepElement = document.getElementById(`step-${index}`);
      if (stepElement) {
        observer.observe(stepElement);
      }
    });

    // Cleanup observer on component unmount
    return () => {
      observer.disconnect();
    };
  }, [stepsData]);

  const closePopup = () => {
    setShowPopup(false);
    // setPopupMessage("");
  };

  return (
    <div className="container">
      <Sidebar
        activeStep={activeStep}
        // handleStepClick={handleStepClick}
        stepsData={stepsData}
        imagerefs={imageRefs}
      />
      <div className="main-content">
        {showPopup && <Popup popupUrl={popupUrl} onClose={closePopup} />}
        <div className="header">
          <button className="exit-button"></button>
          <div className="header-buttons">
            <button
              disabled={isLoading}
              className={`publish-button ${isLoading ? "disabled" : ""}`}
              // className="publish-button"
              onClick={handleGuidetitleordescPublish}
              // title={
              //   isLoading
              //     ? "Button is disabled while updating"
              //     : "Publish your guide"
              // }
            >
              {isLoading ? "Updating..." : "Publish and share"}
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
            <div id={`step-${index}`} key={index}>
              <Step
                key={index}
                step={step}
                index={index}
                imageRefs={imageRefs}
                updateStep={updateStep}
                addStep={addStep}
                deleteStep={deleteStep}
              />
            </div>
          ))}
          {/* {stepsData.map((step, index) => (
            <ImageWithBubble
              imageUrl={step.screenshotUrl}
              relativeCoordinates={step.relativeCoordinates}
            />
          ))} */}
        </div>
      </div>
    </div>
  );
};

export default CreateComponent;

/*
 * TODO:
 * 1. ✅ Delete Step
 * 2. ✅ Dragable Blinking Bubble
 * 3. ✅ Add Step Button Styling
 * 4. placeholder for empty input fields
 * 6. ✅ display final page(popup to copy link or visit viewOnly page)
 * 5. Upload custom image
 * 7. convert base64 image to jpeg/png
 * 8. Migrate to AWS
 * 9. ✅ sidebar view optimization
 * 10. extension optimization
 * 11. remove hydration
 */
