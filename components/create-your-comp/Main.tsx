"use client";
import "./index.css";
import Link from "next/link";
import { Sidebar } from "./Sidebar";
import TopNavbar from "./TopNavbar";
import Step from "./commanComponent/Step";
import Popup from "./commanComponent/Popup";
import AddComp from "./commanComponent/AddComp";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import GuideList from "./commanComponent/GuideList";
import ShimmerStep from "./commanComponent/ShimmerStep";
import { useGuideData } from "./customHooks/useGuideData";
import SCSS from "./moduleStyles/createGuide.module.scss";
import EditableHeader from "./commanComponent/EditableHeader";

const CreateComponent = () => {
  const searchParams = useSearchParams();
  const screenshotId = searchParams.get("id");
  const [activeStep, setActiveStep] = useState(0);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const guideData = useGuideData(screenshotId);

  const {
    popupUrl,
    notFound,
    isLoading,
    stepsData,
    showPopup,
    guideTitle,
    isFetching,
    addStep,
    deleteStep,
    updateStep,
    setStepsData,
    deletingSteps,
    handlePublish,
    hanldeIsLoading,
    handleShowPopup,
    handleGuideTitle,
    guideDescription,
    handleGuideDescription,
  } = guideData!;

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

  return (
    <>
      {!screenshotId && <GuideList />}
      {screenshotId && (
        <>
          <TopNavbar
            isLoading={isLoading}
            handleGuidetitleordescPublish={handlePublish}
          />
          <div className={SCSS.container}>
            <Sidebar
              activeStep={activeStep}
              stepsData={stepsData}
              setStepsData={setStepsData}
            />
            <div className={SCSS.mainContent}>
              {showPopup && (
                <Popup
                  popupUrl={popupUrl}
                  onClose={() => handleShowPopup(false)}
                />
              )}

              {!isFetching && notFound && (
                <div className={SCSS.errorMessage}>
                  <h3>Guide Not Found</h3>
                  <p>
                    The requested guide does not exist. Please check the URL.
                  </p>
                  <Link href="/dashboard">Return to Dashboard</Link>
                </div>
              )}

              {!isFetching && !notFound && (
                <div className={SCSS.guideHeader}>
                  {/* Guide Title */}
                  <p>Title of the guide</p>
                  <EditableHeader
                    textValue={guideTitle}
                    textColor="#33475b"
                    textSize="1.5rem"
                    placeholderValue="Add title of your guide..."
                    setText={handleGuideTitle}
                  />
                  {/* Guide Description */}
                  <p>Description of the guide</p>
                  <EditableHeader
                    textValue={guideDescription}
                    textColor="rgb(44, 169, 225)"
                    textSize="1.15rem"
                    placeholderValue="What is this guide about?"
                    setText={handleGuideDescription}
                  />
                </div>
              )}

              {isFetching && (
                <>
                  <ShimmerStep />
                  <ShimmerStep />
                </>
              )}
              {!isFetching && !notFound && (
                <div className={SCSS.steps}>
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
                          setIsLoading={hanldeIsLoading}
                          updateStep={updateStep}
                          addStep={addStep}
                          deleteStep={deleteStep}
                        />
                      )}
                    </div>
                  ))}
                  {!stepsData.length && <AddComp index={0} addStep={addStep} />}
                </div>
              )}
            </div>
          </div>
        </>
      )}
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
 * 22. ✅ add copy link button on guide as well
 * 23. ✅ (optional)add step without image
 * 23. ✅ DND
 * 23. ✅ working on other browser and in incognito mode as well.
 * 24. (optional)automatic expiry period which deletes image from server and DB
 * 25. ✅ Error Handling for apis
 * 26. ✅ stop capturing btn in ectension popup & control panel
 * 27. minimize ref use
 * 28. ✅ do not pass setState function
 * 30. edit state without passing element.target, by passing name in input field
 * 31. ✅ remove console.logs
 * 32. reusable styles in extension.
 * 33. ✅ homepage (dashboard, view-guide) initial pages.
 * 34. ✅ better folder struct.
 * 35. longer screenshot or selected screenshot.
 * 36. ✅ and add custom step to create guide at last of the guide.
 * 37. ✅ add topnavbar in guide-view
 * 38. popup on screenshot capturing
 * 38. control panel displays for initial 10 seconds.
 * 39. ✅ last updated date
 * added code till commit "rendering view-guide server side" to builder-preview-next (aws package not in there.)
 */

/*
 * CRMOne Colors
 * rgb(44, 169, 225) - blue
 * rgb(255, 89, 66) - Orange
 * rgb(238, 48, 27) - hover Orange
 */
