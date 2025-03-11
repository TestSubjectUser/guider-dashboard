import React from "react";
import { BlinkingBubble } from "./BlinkingBubble";
import EditableHeader from "./EditableHeader";

interface StepProps {
  step: any;
  // step: {
  //   title: string;
  //   description: string;
  //   imageUrl?: string; // Optional step image
  // };
  index: number;
  imageRefs: any;
  updateStep: (index: number, newTitle: string, newDescription: string) => void;
}

const Step: React.FC<StepProps> = ({ step, index, imageRefs, updateStep }) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);

  React.useEffect(() => {
    const img = imageRefs.current[index];
    if (img && img.complete) {
      setImageLoaded(true);
    }
  }, [imageRefs.current[index]]);

  return (
    <div className="step" id={index.toString()} key={index}>
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
          ref={(el) => (imageRefs.current[index] = el)}
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
        {imageLoaded && (
          <BlinkingBubble
            coordinates={{
              x: step.relativeCoordinates.x,
              y: step.relativeCoordinates.y,
            }}
            imageRef={imageRefs.current[index]}
          />
        )}
      </div>
    </div>
  );
};

export default Step;
