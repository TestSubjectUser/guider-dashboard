"use client";
import "./index.css";
import Step from "./Step";
import Popup from "./Popup";
import { Sidebar } from "./Sidebar";
import TopNavbar from "./TopNavbar";
import ShimmerStep from "./ShimmerStep";
import styles from "./createGuide.module.css";
import EditableHeader from "./EditableHeader";
import { GuideDataImagesProps } from "./types";
import { useSearchParams } from "next/navigation";
// import ImageWithBubble from "./ImageWithBubble";
import { useEffect, useRef, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../app/api/save-screenshot/firebaseConfig";

const CreateComponent = () => {
  const searchParams = useSearchParams();
  const screenshotId = searchParams.get("id");

  const [activeStep, setActiveStep] = useState(0);
  const [stepsData, setStepsData] = useState<GuideDataImagesProps>([]);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  // Editable states
  const [guideTitle, setGuideTitle] = useState("");
  const [guideDescription, setGuideDescription] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [popupUrl, setPopupUrl] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [deletingSteps, setDeletingSteps] = useState<number[]>([]);

  // Fetch: from firestore
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
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
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [screenshotId]);
  // initialize imageRefs
  useEffect(() => {
    imageRefs.current = imageRefs.current.slice(0, stepsData.length);
  }, [stepsData]);
  // observer for steps
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

  // Func: update step
  const updateStep = async (
    index: number,
    newTitle: string,
    newDescription: string,
    newCoordinates: { x: number; y: number } | null,
    newScreenshotUrl?: string | null,
    newScale?: number
  ) => {
    const updatedSteps = [...stepsData];
    updatedSteps[index] = {
      ...updatedSteps[index],
      title: newTitle,
      description: newDescription,
      relativeCoordinates: newCoordinates,
      screenshotUrl: newScreenshotUrl ?? null,
      scale: newScale ?? updatedSteps[index].scale,
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
      scale: 1,
    });
    setStepsData(updatedSteps);
  };
  const deleteStep = async (index: number) => {
    setIsLoading(true);
    setDeletingSteps((prev) => [...prev, index]);
    const imageUrl = stepsData[index].screenshotUrl;

    try {
      if (
        imageUrl &&
        (imageUrl.includes("amazonaws") ||
          imageUrl.includes("guider-extension"))
      ) {
        await fetch("/api/aws", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl }),
        });

        console.log("Image deleted from AWS");
      }

      const updatedSteps = [...stepsData];
      updatedSteps.splice(index, 1);
      setStepsData(updatedSteps);
    } catch (error) {
      console.error("Failed to delete image:", error);
    } finally {
      setDeletingSteps((prev) => prev.filter((i) => i !== index));
      setIsLoading(false);
    }

    // by doing this need fs lib cause clodinary works on srver side like on nodejs
    // deleteImageFromCloudinary(stepsData[index].screenshotUrl);
    // const updatedSteps = [...stepsData];
    // updatedSteps.splice(index, 1);
    // setStepsData(updatedSteps);
  };
  const handlePublish = async () => {
    setIsLoading(true);
    if (!screenshotId) return;

    try {
      // console.log("screenshotId: ", screenshotId);
      // console.log("guideTitle: ", guideTitle);
      // console.log("guideDescription: ", guideDescription);
      const docRef = doc(db, "guides", screenshotId);
      // console.log("docRef: ", docRef);
      await updateDoc(docRef, {
        guideTitle: guideTitle || "",
        guideDescription: guideDescription || "",
        guideImages: stepsData,
      });
      // alert("Guide updated successfully!");
      setPopupUrl("http://localhost:3000/view-guide?id=" + screenshotId);
      // setPopupUrl("https://localhost:3000/create-your-comp/view-guide?id=" + screenshotId);
      setShowPopup(true);
    } catch (e) {
      console.error("Error updating document: ", e);
    }
    setIsLoading(false);
  };

  return (
    <>
      <TopNavbar
        isLoading={isLoading}
        handleGuidetitleordescPublish={handlePublish}
      />
      <div className={styles.container}>
        <Sidebar
          activeStep={activeStep}
          stepsData={stepsData}
          setStepsData={setStepsData}
        />
        <div className={styles.mainContent}>
          {showPopup && (
            <Popup popupUrl={popupUrl} onClose={() => setShowPopup(false)} />
          )}

          <div className={styles.guideHeader}>
            {/* Guide Title */}
            <p>Title of the guide</p>
            <EditableHeader
              textValue={guideTitle}
              textColor=""
              textSize="1.5rem"
              placeholderValue="Add title of your guide..."
              setText={setGuideTitle}
            />
            {/* Guide Description */}
            <p>Description of the guide</p>
            <EditableHeader
              textValue={guideDescription}
              textColor="rgb(44, 169, 225)"
              textSize="1.15rem"
              placeholderValue="What is this guide about?"
              setText={setGuideDescription}
            />
          </div>

          {stepsData.length === 0 && (
            <>
              <ShimmerStep />
              <ShimmerStep />
            </>
          )}

          <div className={styles.steps}>
            {stepsData.map((step, index) => (
              <div key={index} id={`step-${index}`}>
                {deletingSteps.includes(index) ? (
                  <ShimmerStep />
                ) : (
                  <Step
                    key={index}
                    step={step}
                    index={index}
                    imageRefs={imageRefs}
                    setIsLoading={setIsLoading}
                    updateStep={updateStep}
                    addStep={addStep}
                    deleteStep={deleteStep}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
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
 * 7. ✅ convert base64 image to jpeg/png
 * 8. ✅ Migrate to AWS
 * 9. ✅ sidebar view optimization
 * 10. ✅ extension style globalization optimization
 * 11. remove hydration
 * 12. ✅ DELETE image on switch as well
 * 13. ✅ FIX: Step.tsx:34L converts external image url into bas64 as well, image urli picked was in base64 that's why
 * 14. ✅ scenario where uploaded image is from aws as well, @L123 already fixed
 * 15. ✅ handle empty data in extension or in route.
 * 16. ✅ Dragable from sidebar
 * 17. ✅ disabling delete image and swap image action if similar action is in happening
 * 18. ✅ transform-origin for zoom-in-out
 * 19. ✅ add step without bubble if coordinates undefined
 * 20. ✅ on schreenshot step added as well, but without bubble
 * 21. ✅ step buttons(zoom, delete, swap) on hover only
 * 22. add copy link button on guide as well
 * 23. ✅ (optional)add step without image
 * 23. ✅ DND
 * 23. ✅ working on other browser and in incognito mode as well.
 * 24. (optional)automatic expiry period which deletes image from server and DB
 *
 * added code till commit "rendering view-guide server side" to builder-preview-next (aws package not in there.)
 */

/*
 * CRMOne Colors
 * rgb(44, 169, 225) - blue
 * rgb(255, 89, 66) - Orange
 * rgb(238, 48, 27) - hover Orange
 */
