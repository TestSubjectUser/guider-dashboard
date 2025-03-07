"use client";
import React, { useState, useEffect, useRef } from "react";
import { data as guideData } from "../../app/data";
import "./index.css";

const CreateComponent = () => {
  const [activeStep, setActiveStep] = useState(0);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  // Initialize the refs array with the length of guideData
  useEffect(() => {
    imageRefs.current = imageRefs.current.slice(0, guideData.length);
  }, []);

  const handleStepClick = (index: number) => {
    setActiveStep(index);
  };

  const renderBlinkingBubble = (
    coordinates: { x: number; y: number },
    imageRef: HTMLImageElement | null
  ) => {
    if (!imageRef) return null;

    const imageRect = imageRef.getBoundingClientRect();

    // console.log("imageRect.width", imageRect.width);
    // console.log("imageRect.height", imageRect.height);
    const adjustedX = (imageRect.width * coordinates.x) / 100;
    const adjustedY = (imageRect.height * coordinates.y) / 100;

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
          transform: "translate(-50%, -50%)", // Center bubble
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
              {`${index + 1}. ${step.title}`}
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

        {/* each step header */}
        <div className="steps">
          {guideData.map((step, index) => {
            return (
              <div className="step" key={index}>
                <div className="step-header">
                  <div className="step-number">{index + 1}</div>
                  <h4>{step.title}</h4>
                  <button className="edit-button">
                    <i className="">edit</i>
                  </button>
                </div>
                <p>{step.description}</p>

                {/* with bubble */}
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
                      maxWidth: "100%",
                      objectFit: "contain",
                    }}
                  ></img>
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
