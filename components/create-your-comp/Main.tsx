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
  const deleteStep = async (index: number) => {
    const imageUrl = stepsData[index].screenshotUrl;

    try {
      if (imageUrl.includes("amazonaws", "guider-extension")) {
        await fetch("/api/cloudinary", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl }),
        });

        console.log("Image deleted from Cloudinary");
      }

      const updatedSteps = [...stepsData];
      updatedSteps.splice(index, 1);
      setStepsData(updatedSteps);
    } catch (error) {
      console.error("Failed to delete image:", error);
    }
    // by doing this need fs lib cause clodinary works on srver side like on nodejs
    // deleteImageFromCloudinary(stepsData[index].screenshotUrl);
    // const updatedSteps = [...stepsData];
    // updatedSteps.splice(index, 1);
    // setStepsData(updatedSteps);
  };
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepIndex = parseInt(entry.target.id.replace("step-", ""));
            setActiveStep(stepIndex);
          }
        });
      },
      { threshold: 0.5 }
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

  return (
    <div className="container">
      <Sidebar
        activeStep={activeStep}
        stepsData={stepsData}
        imagerefs={imageRefs}
      />
      <div className="main-content">
        {showPopup && (
          <Popup popupUrl={popupUrl} onClose={() => setShowPopup(false)} />
        )}
        <div className="header">
          <div className="header-buttons">
            <button
              disabled={isLoading}
              className={`publish-button ${isLoading ? "disabled" : ""}`}
              onClick={handleGuidetitleordescPublish}
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
            placeholderValue="add title of your guide..."
            setText={setGuideTitle}
          />
          <EditableHeader
            textValue={guideDescription}
            textColor="rgb(44, 169, 225)"
            textSize="1.15rem"
            placeholderValue="add description of your guide..."
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
 * 4. ✅ placeholder for empty input fields
 * 6. ✅ display final page(popup to copy link or visit viewOnly page)
 * 5. ✅ Upload custom image
 * 7. convert base64 image to jpeg/png
 * 8. ✅ Migrate to AWS
 * 9. ✅ sidebar view optimization
 * 10. extension optimization
 * 11. remove hydration
 * 12. DELETE image or switch as well
 */

/*
 * CRMOne Colors
 * rgb(44, 169, 225) - blue
 * rgb(255, 89, 66) - Orange
 * rgb(238, 48, 27) - hover Orange
 */
