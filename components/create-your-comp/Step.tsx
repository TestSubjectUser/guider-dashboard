import React from "react";
import { BlinkingBubble } from "./BlinkingBubble";

function Step({ step, index, imageRefs }: any) {
  const [imageLoaded, setImageLoaded] = React.useState(false);

  React.useEffect(() => {
    const img = imageRefs.current[index];
    if (img && img.complete) {
      setImageLoaded(true);
    }
  }, [imageRefs.current[index]]);

  return (
    <div className="step">
      <div className="step-header">
        <div className="step-title-with-number">
          <div className="step-number">{index + 1}</div>
          {/* <h4>{step.title}</h4> */}
          <h4>{step.id}</h4>
        </div>
        <button className="edit-button">
          <i className="">edit</i>
        </button>
      </div>
      <p>{step.description}</p>

      <div className="image-container" style={{ position: "relative" }}>
        <img
          ref={(el) => (imageRefs.current[index] = el)}
          src={step.screenshotUrl}
          // alt={step.title}
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
            coordinates={step.relativeCoordinates}
            imageRef={imageRefs.current[index]}
          />
        )}
      </div>
    </div>
  );
}

export default Step;
