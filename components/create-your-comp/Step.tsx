import React from "react";
import AddComp from "./AddComp";
import { StepProps } from "./types";
import EditableHeader from "./EditableHeader";
import { BlinkingBubble } from "./BlinkingBubble";
import ChangeImagePopup from "./ChangeImagePopup";
import styles from "./createGuide.module.css";

// const Step: React.FC<StepProps> = ({
const Step = ({
  step,
  index,
  imageRefs,
  isLoading,
  setIsLoading,
  updateStep,
  addStep,
  deleteStep,
}: StepProps) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [zoomState, setZoomState] = React.useState(1);

  const [showChangeImagePopup, setShowChangeImagePopup] = React.useState(false);

  React.useEffect(() => {
    const img = imageRefs.current[index];
    if (img && img.complete) {
      setImageLoaded(true);
    }
    // console.log("step.relativeCoordinates ", step.relativeCoordinates);
  }, [imageRefs.current[index]]);

  const handleSwapClick = () => {
    console.log("Swap icon clicked for step:", index);
    console.log("image: ", step.screenshotUrl);
    setShowChangeImagePopup(true);
    // step.screenshotUrl =
    //   "https://media.istockphoto.com/id/2153573059/photo/mountain-covered-with-a-coniferous-fir-tree-forest-scenic-landscape-from-carpathian-mountains.jpg?s=1024x1024&w=is&k=20&c=hwDTriUtxDP_4A6jQKVRWTTTXLf8jim4w3w1K2dcaHU=";
  };

  function handleImageUpload(imageLink: string) {
    setIsLoading(true);
    console.log("stepData State changed");
    // step.screenshotUrl = imageLink;
    updateStep(
      index,
      step.title,
      step.description,
      step.relativeCoordinates,
      imageLink
    );
    // console.log("imageLink", imageLink);
    // console.log("after update image: ", step.screenshotUrl);
    setShowChangeImagePopup(false);
    setIsLoading(false);
  }

  function zoomHandler(zoomBy: number) {
    setZoomState((prev) => {
      if (prev + zoomBy < 1) return 1;
      if (prev + zoomBy > 2) return 2;
      return prev + zoomBy;
    });
  }

  return (
    <>
      {showChangeImagePopup && (
        <ChangeImagePopup
          oldImageUrl={step.screenshotUrl}
          handleImageUpload={handleImageUpload}
          setIsLoading={setIsLoading}
          // setPopupChangeImageUrl={setPopupChangeImageUrl}
          setShowChangeImagePopup={setShowChangeImagePopup}
        />
      )}
      {index === 0 && <AddComp index={0} addStep={addStep} />}
      <div className={styles.step} id={index.toString()} key={index}>
        {imageLoaded && (
          <div
            className={
              isLoading ? styles.disabledButton : styles.stepActionContainer
            }
          >
            <button onClick={() => deleteStep(index)}>
              <img
                width="20"
                height="20"
                src="https://img.icons8.com/ios-filled/50/FFFFFF/waste.png"
                alt="waste"
              />
            </button>
            <button>
              <img
                width="20"
                height="20"
                src="https://img.icons8.com/ios-filled/50/FFFFFF/ellipsis.png"
                alt="ellipsis"
              />
            </button>
          </div>
        )}

        <div className={styles.stepHeader}>
          <div className={styles.stepNumber}>{index + 1}</div>
          <EditableHeader
            textValue={step.title}
            textColor=""
            textSize=""
            placeholderValue="enter title for this step..."
            setText={(newText) => updateStep(index, newText, step.description)}
          />
        </div>
        <div className={styles.stepDescription}>
          <EditableHeader
            textValue={step.description}
            textColor="gray"
            textSize=""
            placeholderValue="add description for this step..."
            setText={(newText) => updateStep(index, step.title, newText)}
          />
        </div>

        <div
          className={styles.imageContainer}
          style={{ position: "relative", overflow: "hidden" }}
        >
          <img
            ref={(el) => {
              imageRefs.current[index] = el;
            }}
            src={
              step.screenshotUrl ||
              "https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png"
            }
            alt={step.title}
            className={styles.stepImage}
            onLoad={() => setImageLoaded(true)}
            style={{
              transition: "transform 0.5s ease-out",
              transform: `scale(${zoomState})`,
              // scale: imageLoaded ? zoomState : 1,
              transformOrigin: `${step.relativeCoordinates.x}% ${step.relativeCoordinates.y}%`,
            }}
          />

          {imageLoaded && (
            // <div
            //   className={
            //     isLoading ? styles.disabledButton : styles.swapContainer
            //   }
            //   onMouseEnter={() => setShowPopover(true)}
            //   onMouseLeave={() => setShowPopover(false)}
            //   onClick={handleSwapClick}
            // >
            //   <Image
            //     src={swapIcon.src}
            //     alt="Swap"
            //     width={25}
            //     height={25}
            //     className={styles.swapIcon}
            //   />
            //   {showPopover && (
            //     <div className={styles.popover}>
            //       Click to swap image (Soon.)
            //     </div>
            //   )}
            // </div>
            <div
              className={
                isLoading ? styles.disabledButton : styles.imageActionContainer
              }
            >
              <button onClick={() => zoomHandler(0.2)}>
                <img
                  width="20"
                  height="20"
                  src="https://img.icons8.com/sf-black-filled/64/FFFFFF/zoom-in.png"
                  alt="zoom-in"
                />
              </button>
              <button onClick={() => zoomHandler(-0.2)}>
                <img
                  width="20"
                  height="20"
                  src="https://img.icons8.com/sf-black-filled/64/FFFFFF/zoom-out.png"
                  alt="zoom-out"
                />
              </button>
              <button
                onClick={handleSwapClick}
                style={{
                  // display: "flex",
                  // alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <img
                  width="20"
                  height="20"
                  src="https://img.icons8.com/sf-black-filled/64/FFFFFF/edit-image.png"
                  alt="edit-image"
                />
                {/* swap img */}
              </button>
            </div>
          )}

          {imageLoaded && (
            // update BlinkingBubble state if Zoom Handler is called
            <BlinkingBubble
              coordinates={{
                x: step.relativeCoordinates.x,
                y: step.relativeCoordinates.y,
              }}
              imageRef={imageRefs.current[index]}
              updateCoordinates={(newCoordinates) => {
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
