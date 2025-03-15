import React from "react";
import { BlinkingBubble } from "./BlinkingBubble";
import EditableHeader from "./EditableHeader";
import AddComp from "./AddComp";
import swapIcon from "../../public/swapIcon.png";
import Image from "next/image";
interface StepProps {
  step: any;
  // step: {
  //   title: string;
  //   description: string;
  //   imageUrl?: string; // Optional step image
  // };
  index: number;
  imageRefs: any;
  updateStep: (
    index: number,
    newTitle: string,
    newDescription: string,
    newCoordinates?: { x: number; y: number }
  ) => void;
  addStep: (
    index: number,
    newTitle: string,
    newDescription: string,
    screenshotUrl: string,
    relativeCoordinates: { x: number; y: number }
  ) => void;
  deleteStep: (index: number) => void;
}

const Step: React.FC<StepProps> = ({
  step,
  index,
  imageRefs,
  updateStep,
  addStep,
  deleteStep,
}) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [showPopover, setShowPopover] = React.useState(false);

  React.useEffect(() => {
    const img = imageRefs.current[index];
    if (img && img.complete) {
      setImageLoaded(true);
    }
    // console.log("step.relativeCoordinates ", step.relativeCoordinates);
  }, [imageRefs.current[index]]);

  const handleSwapClick = () => {
    console.log("Swap icon clicked for step:", index);
  };

  return (
    <>
      {index === 0 && <AddComp index={0} addStep={addStep} />}
      <div className={`step`} id={index.toString()} key={index}>
        <div className="delete-button" onClick={() => deleteStep(index)}>
          delete
        </div>
        <div className="step-header">
          <div className="step-number">{index + 1}</div>
          <EditableHeader
            textValue={step.title}
            textColor=""
            textSize=""
            setText={(newText) => updateStep(index, newText, step.description)}
          />
        </div>
        <div className="step-description">
          <EditableHeader
            textValue={step.description}
            textColor="gray"
            textSize=""
            setText={(newText) => updateStep(index, step.title, newText)}
          />
        </div>

        <div
          className="image-container"
          style={{ position: "relative", overflow: "hidden" }}
        >
          <img
            ref={(el) => {
              imageRefs.current[index] = el;
            }}
            src={step.screenshotUrl}
            alt={step.id}
            className="step-image"
            onLoad={() => setImageLoaded(true)}
            style={{
              maxHeight: "600px",
              maxWidth: "100%",
              objectFit: "contain",
            }}
          />

          {/* {imageLoaded && (
            <Image
              src={swapIcon.src}
              alt="Swap"
              className="swap-icon"
              width={40}
              height={40}
              onClick={handleSwapClick}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                width: "30px",
                height: "30px",
                cursor: "pointer",
                backgroundColor: "rgba(255, 255, 255, 1)",
                borderRadius: "50%",
                padding: "5px",
              }}
            />
          )} */}

          {imageLoaded && (
            <div
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                width: "40px",
                height: "40px",
                cursor: "pointer",
                backgroundColor: "rgba(255, 255, 255, 1)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "3px",
              }}
              onMouseEnter={() => setShowPopover(true)}
              onMouseLeave={() => setShowPopover(false)}
              onClick={handleSwapClick}
            >
              <Image
                src={swapIcon.src}
                alt="Swap"
                width={25}
                height={25}
                style={{
                  objectFit: "contain",
                }}
              />
              {showPopover && (
                <div
                  style={{
                    position: "absolute",
                    top: "50px",
                    right: "0",
                    backgroundColor: "rgba(232, 222, 222, 0.8)",
                    color: "black",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    fontSize: "12px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Click to swap image(Soon.)
                </div>
              )}
            </div>
          )}

          {imageLoaded && (
            <BlinkingBubble
              coordinates={{
                x: step.relativeCoordinates.x,
                y: step.relativeCoordinates.y,
              }}
              imageRef={imageRefs.current[index]}
              updateCoordinates={(newCoordinates) => {
                // console.log("newCoordinates", newCoordinates);
                updateStep(index, step.title, step.description, newCoordinates);
              }}
            />
          )}
        </div>
      </div>
      <AddComp index={index + 1} addStep={addStep} />
    </>
  );
};

export default Step;
