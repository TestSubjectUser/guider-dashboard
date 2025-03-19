"use client";
import "./index.css";
import React from "react";
import { GuideDataImagesProps } from "./types";

export const Sidebar = ({
  activeStep,
  stepsData,
}: {
  activeStep: number;
  stepsData: GuideDataImagesProps;
}) => {
  const handleClick = (index: number) => {
    window.location.hash = `#${index}`;
    scrollToStep(index);
  };
  const scrollToStep = (index: number) => {
    const stepElement = document.getElementById(`step-${index}`);
    if (stepElement) {
      stepElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>SideBar | MyDomain</h2>
      </div>
      <ul className="sidebar-list">
        {stepsData.map((step, index) => (
          <a
            key={index}
            id={index.toString()}
            href={`#${index.toString()}`}
            style={{ textDecoration: "none", color: "black", cursor: "auto" }}
          >
            <li
              id={index.toString()}
              key={index}
              className={activeStep === index ? "active" : ""}
              onClick={() => handleClick(index)}
            >
              {`${index + 1}. ${step.title}`}
            </li>
          </a>
        ))}
      </ul>
    </div>
  );
};
