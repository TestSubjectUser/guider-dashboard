import React from "react";
import { BlinkingBubble } from "./BlinkingBubble";

function Step({ step, index, imageRefs }: any) {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [zoomLevel, setZoomLevel] = React.useState(1);

  React.useEffect(() => {
    const img = imageRefs.current[index];
    if (img && img.complete) {
      setImageLoaded(true);
    }
  }, [imageRefs.current[index]]);

  // Zoom In
  const handleZoomIn = () => {
    setZoomLevel((prevZoom) => Math.min(prevZoom + 0.2, 3)); // Max zoom level: 3x
  };
  // Zoom Out
  const handleZoomOut = () => {
    setZoomLevel((prevZoom) => Math.max(prevZoom - 0.2, 1)); // Min zoom level: 1x (original size)
  };

  return (
    <div className="step" id={index.toString()} key={index}>
      <div className="step-header">
        <div className="step-title-with-number">
          <div className="step-number">{index + 1}</div>
          <h4>{step.title}</h4>
          {/* <h4>{step.id}</h4> */}
        </div>
        <button className="edit-button">
          <i className="">edit</i>
        </button>
      </div>
      <div className="step-description">
        <p>add description</p>
        <button className="edit-button">
          <i className="">edit</i>
        </button>
      </div>

      <div
        className="image-container"
        style={{ position: "relative", overflow: "hidden" }}
      >
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
            transform: `scale(${zoomLevel})`,
            transformOrigin: "center center",
            transition: "transform 0.2s ease-in-out",
          }}
        />
        {imageLoaded && (
          <BlinkingBubble
            coordinates={{
              x: step.relativeCoordinates.x * zoomLevel,
              y: step.relativeCoordinates.y * zoomLevel,
            }}
            imageRef={imageRefs.current[index]}
          />
        )}
      </div>
      <div className="zoom-controls">
        <button onClick={handleZoomOut} className="zoom-button">
          ➖ Zoom Out
        </button>
        <button onClick={handleZoomIn} className="zoom-button">
          ➕ Zoom In
        </button>
      </div>
    </div>
  );
}

export default Step;
