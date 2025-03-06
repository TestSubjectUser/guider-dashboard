"use client";
import React, { useState, useEffect, useRef } from "react";
import { data as guideData } from "../../app/data"; // Importing the guide data
import "./index.css";

const CreateComponent = () => {
  // State to track steps
  const [activeStep, setActiveStep] = useState(0);
  // Add refs for image containers
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  // Initialize the refs array with the length of guideData
  useEffect(() => {
    imageRefs.current = imageRefs.current.slice(0, guideData.length);
  }, []);

  // Function to handle step navigation
  const handleStepClick = (index: number) => {
    setActiveStep(index);
  };

  // Function to render blinking bubble based on relative coordinates
  const renderBlinkingBubble = (
    coordinates: { x: number; y: number },
    imageRef: HTMLImageElement | null
  ) => {
    if (!imageRef) return null;

    // Get the image's natural size
    const imageWidth = imageRef.naturalWidth;
    const imageHeight = imageRef.naturalHeight;

    // Get the container's size
    const imageRect = imageRef.getBoundingClientRect();

    // Calculate the scaling factor based on the container size and the image's natural size
    const scaleX = imageRect.width / imageWidth;
    const scaleY = imageRect.height / imageHeight;

    // Adjust the coordinates according to the scale
    const adjustedX = (coordinates.x / 100) * imageWidth * scaleX;
    const adjustedY = (coordinates.y / 100) * imageHeight * scaleY;

    return (
      <div
        style={{
          position: "absolute",
          top: `${adjustedY}px`,
          left: `${adjustedX}px`,
          width: "30px",
          height: "30px",
          backgroundColor: "rgba(255, 0, 0, 0.5)",
          borderRadius: "50%",
          animation: "blink 1s infinite",
          transform: "translate(-50%, -50%)", // Center the bubble on the coordinates
          zIndex: 10,
        }}
      ></div>
    );
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Prospecting | HubSpot</h2>
        </div>
        <ul className="sidebar-list">
          {guideData.map((step, index) => (
            <li
              key={index}
              className={activeStep === index ? "active" : ""}
              onClick={() => handleStepClick(index)}
            >
              {`${step.stepNumber}. ${step.title}`}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <button className="exit-button">
            <i className="fas fa-arrow-left"></i> Exit
          </button>
          <div className="header-buttons">
            <button className="saved-button">Saved</button>
            <button className="publish-button">Publish and share</button>
          </div>
        </div>

        <div className="guide-info">
          <h1>Title of the guide</h1>
          <h2>Guide - Prospecting | HubSpot</h2>
          <h3>Description of the guide</h3>
          <p>What is this guide about?</p>
        </div>

        {/* Render Steps */}
        <div className="steps">
          {guideData.map((step, index) => {
            return (
              <div className="step" key={index}>
                <div className="step-header">
                  <div className="step-number">{step.stepNumber}</div>
                  <h4>{step.title}</h4>
                  <button className="edit-button">
                    <i className="fas fa-pen"></i>
                  </button>
                </div>
                <p>{step.description}</p>

                {/* Render the image with bubble */}
                <div
                  className="image-container"
                  style={{ position: "relative" }}
                >
                  <img
                    ref={(el) => (imageRefs.current[index] = el)}
                    src={step.screenshotUrl}
                    alt={step.title}
                    className="step-image"
                    style={{
                      maxHeight: "600px",
                      width: "100%",
                      objectFit: "contain",
                    }}
                  />
                  {/* Render blinking bubble for each step */}
                  {renderBlinkingBubble(
                    step.relativeCoordinates,
                    imageRefs.current[index]
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CreateComponent;

// import React from "react";
// import "./index.css";

// const CreateComponent = () => {
//   return (
//     <div className="container">
//       {/* <!-- Sidebar --> */}
//       <div className="sidebar">
//         <div className="sidebar-header">
//           <h2>Prospecting | HubSpot</h2>
//         </div>
//         <ul className="sidebar-list">
//           <li className="active">1. Navigate to Prospecting | HubSpot</li>
//           <li>2. Click on Page Section</li>
//           <li>3. Click on Contacts</li>
//           <li>4. Click on Companies</li>
//           <li>5. Click on Pandas Foundation</li>
//           <li>6. Click on highlighted area</li>
//           <li>7. Click on highlighted area</li>
//         </ul>
//       </div>
//       {/* <!-- Main Content --> */}
//       <div className="main-content">
//         <div className="header">
//           <button className="exit-button">
//             <i className="fas fa-arrow-left"></i> Exit
//           </button>
//           <div className="header-buttons">
//             <button className="saved-button">Saved</button>
//             <button className="publish-button">Publish and share</button>
//           </div>
//         </div>
//         <div className="guide-info">
//           <h1>Title of the guide</h1>
//           <h2>Guide - Prospecting | HubSpot</h2>
//           <h3>Description of the guide</h3>
//           <p>What is this guide about?</p>
//         </div>
//         <div className="steps">
//           <div className="step">
//             <div className="step-header">
//               <div className="step-number">1</div>
//               <h4>Navigate to Prospecting | HubSpot</h4>
//               <button className="edit-button">
//                 <i className="fas fa-pen"></i>
//               </button>
//             </div>
//             <p>Add a description</p>
//           </div>
//           <div className="step">
//             <div className="step-header">
//               <div className="step-number">2</div>
//               <h4>Click on Page Section</h4>
//               <button className="edit-button">
//                 <i className="fas fa-pen"></i>
//               </button>
//             </div>
//             <p>Add a description</p>
//             <img
//               src="https://placehold.co/600x400"
//               alt="Screenshot of the Prospecting page in HubSpot showing various tabs and options"
//               className="step-image"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateComponent;
