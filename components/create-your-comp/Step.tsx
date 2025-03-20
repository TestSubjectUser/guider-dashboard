import React from "react";
import Image from "next/image";
import AddComp from "./AddComp";
import { StepProps } from "./types";
import EditableHeader from "./EditableHeader";
import swapIcon from "../../public/swapIcon.png";
import { BlinkingBubble } from "./BlinkingBubble";
import ChangeImagePopup from "./ChangeImagePopup";
import styles from "./createGuide.module.css";

// const Step: React.FC<StepProps> = ({
const Step = ({
  step,
  index,
  imageRefs,
  updateStep,
  addStep,
  deleteStep,
}: StepProps) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [showPopover, setShowPopover] = React.useState(false);

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
    // TODO : loading state - updating image... - disable publish and share button, also delete button
    // implement updating step in here
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
    // TODO : loading state - set to false - enable publish and share button
  }

  return (
    <>
      {showChangeImagePopup && (
        <ChangeImagePopup
          oldImageUrl={step.screenshotUrl}
          handleImageUpload={handleImageUpload}
          // setPopupChangeImageUrl={setPopupChangeImageUrl}
          setShowChangeImagePopup={setShowChangeImagePopup}
        />
      )}
      {index === 0 && <AddComp index={0} addStep={addStep} />}
      <div className={styles.step} id={index.toString()} key={index}>
        <div className={styles.delMoveDevider}>
          <div className={styles.moveIcon}></div>
          <button
            className={styles.deleteButton}
            onClick={() => deleteStep(index)}
          >
            delete
          </button>
        </div>
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
              maxHeight: "600px",
              maxWidth: "100%",
              objectFit: "contain",
            }}
          />

          {imageLoaded && (
            <div
              className={styles.swapContainer}
              onMouseEnter={() => setShowPopover(true)}
              onMouseLeave={() => setShowPopover(false)}
              onClick={handleSwapClick}
            >
              <Image
                src={swapIcon.src}
                alt="Swap"
                width={25}
                height={25}
                className={styles.swapIcon}
              />
              {showPopover && (
                <div className={styles.popover}>
                  Click to swap image (Soon.)
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
