"use client";
import React from "react";
import styles from "./createGuide.module.css";
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
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h2>SideBar | MyDomain</h2>
      </div>
      <ul className={styles.sidebarList}>
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
              className={activeStep === index ? styles.active : ""}
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
