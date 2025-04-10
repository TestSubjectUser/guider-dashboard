import React from "react";
import ToolTip from "./ToolTip";
import AddComp from "./AddComp";
import { StepProps } from "../utils/types";
import EditableHeader from "./EditableHeader";
import { BlinkingBubble } from "./BlinkingBubble";
import ChangeImagePopup from "./ChangeImagePopup";
import SCSS from "../moduleStyles/Step.module.scss";
import Image from "next/image";

// const Step: React.FC<StepProps> = ({
const Step = ({
  step,
  index,
  imageRefs,
  setIsLoading,
  updateStep,
  addStep,
  deleteStep,
}: StepProps) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [zoomState, setZoomState] = React.useState(1);
  const [showTooltip, setShowTooltip] = React.useState(false);

  const [showChangeImagePopup, setShowChangeImagePopup] = React.useState(false);

  React.useEffect(() => {
    const img = imageRefs.current[index];
    if (img && img.complete) {
      setImageLoaded(true);
    }
    setZoomState(step.scale ?? 1);

    if (step.scale > 1) {
      // delaying
      setTimeout(() => setZoomState(step.scale), 3);
    }
  }, [imageRefs.current[index]]);

  const handleSwapClick = () => {
    setShowChangeImagePopup(true);
  };

  function handleImageUpload(imageLink: string) {
    setIsLoading(true);
    updateStep(
      index,
      step.title,
      step.description,
      step.relativeCoordinates,
      imageLink
    );
    setShowChangeImagePopup(false);
    setIsLoading(false);
  }

  function zoomHandler(zoomBy: number) {
    setZoomState((prev) => {
      return Math.max(1, Math.min(prev + zoomBy, 2));
    });
    updateStep(
      index,
      step.title,
      step.description,
      step.relativeCoordinates,
      step.screenshotUrl,
      zoomState
    );
  }

  async function handleRemoveImage(imageUrl: string) {
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
      }
    } catch (error) {
      // TODO: failde to delete img toast
    }
  }

  return (
    <>
      {showChangeImagePopup && (
        <ChangeImagePopup
          oldImageUrl={step.screenshotUrl!}
          handleImageUpload={handleImageUpload}
          setIsLoading={setIsLoading}
          setShowChangeImagePopup={setShowChangeImagePopup}
        />
      )}
      {index === 0 && <AddComp index={0} addStep={addStep} />}
      <div
        onMouseLeave={() => setShowTooltip(false)}
        className={SCSS.step}
        id={index.toString()}
        key={index}
      >
        {
          <div className={SCSS.stepActionContainer}>
            <button title="Delete this step" onClick={() => deleteStep(index)}>
              <img
                width="20"
                height="20"
                src="https://img.icons8.com/ios-filled/50/FFFFFF/waste.png"
                alt="waste"
              />
            </button>
            <button
              title="More options"
              onClick={() => setShowTooltip((prev) => !prev)} // Toggle tooltip on click
            >
              <img
                width="20"
                height="20"
                src="https://img.icons8.com/ios-filled/50/FFFFFF/ellipsis.png"
                alt="ellipsis"
              />
            </button>
          </div>
        }
        {showTooltip && (
          <ToolTip
            setShowTooltip={setShowTooltip}
            handleRemoveImage={handleRemoveImage}
            updateStep={updateStep}
            step={step}
            index={index}
          />
        )}

        <div className={SCSS.stepHeader}>
          <div className={SCSS.stepNumber}>{index + 1}</div>
          <EditableHeader
            textValue={step.title}
            textColor="#33475b"
            textSize=""
            placeholderValue="enter title for this step..."
            setText={(newText) =>
              updateStep(
                index,
                newText,
                step.description,
                step.relativeCoordinates,
                step.screenshotUrl
              )
            }
          />
        </div>
        <div className={SCSS.stepDescription}>
          <EditableHeader
            textValue={step.description}
            textColor="#33475b"
            textSize="x-small"
            placeholderValue="add description for this step..."
            setText={(newText) =>
              updateStep(
                index,
                step.title,
                newText,
                step.relativeCoordinates,
                step.screenshotUrl
              )
            }
          />
        </div>

        {/* below all code works only if image exists. with relative coords*/}
        {step.screenshotUrl && (
          <div
            className={SCSS.imageContainer}
            style={{ position: "relative", overflow: "hidden" }}
          >
            <div style={{ position: "relative", display: "inline-block" }}>
              <img
                ref={(el) => {
                  imageRefs.current[index] = el;
                }}
                src={
                  step.screenshotUrl ||
                  "https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png"
                }
                alt={step.title}
                className={SCSS.stepImage}
                onLoad={() => setImageLoaded(true)}
                style={{
                  transition: "transform 0.5s ease-out",
                  transform: `scale(${zoomState})`,
                  transformOrigin: `${step?.relativeCoordinates?.x}% ${step?.relativeCoordinates?.y}%`,
                  position: "relative", // Ensures absolute positioning inside
                }}
              />

              {step.relativeCoordinates && imageLoaded && (
                <BlinkingBubble
                  coordinates={{
                    x: step.relativeCoordinates.x,
                    y: step.relativeCoordinates.y,
                  }}
                  imageRef={imageRefs.current[index]}
                  updateCoordinates={(newCoordinates) => {
                    updateStep(
                      index,
                      step.title,
                      step.description,
                      newCoordinates,
                      step.screenshotUrl
                    );
                  }}
                />
              )}
            </div>
            {imageLoaded && (
              <div
                className={SCSS.imageActionContainer}
                // className={
                //   isLoading ? SCSS.disabledButton : SCSS.imageActionContainer
                // }
              >
                <button title="Zoom In" onClick={() => zoomHandler(0.2)}>
                  <Image
                    width="20"
                    height="20"
                    src="/assets/zoom-in.png"
                    alt="zoom-in"
                  />
                </button>
                <button title="Zoom Out" onClick={() => zoomHandler(-0.2)}>
                  <Image
                    width="20"
                    height="20"
                    src="/assets/zoom-out.png"
                    alt="zoom-out"
                  />
                </button>
                <button title="Change Image" onClick={handleSwapClick}>
                  <Image
                    width="20"
                    height="20"
                    src="/assets/edit-image.png"
                    alt="edit-image"
                  />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <AddComp index={index + 1} addStep={addStep} />
    </>
  );
};

export default Step;
