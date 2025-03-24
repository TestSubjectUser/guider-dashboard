"use client";
import React from "react";
import styles from "./moduleStyles/Sidebar.module.css";
import { GuideDataImagesProps } from "./types";

export const Sidebar = ({
  activeStep,
  stepsData,
  setStepsData,
}: {
  activeStep: number;
  stepsData: GuideDataImagesProps;
  setStepsData: any;
}) => {
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null);

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

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;
    setHoverIndex(index);
    console.log("hoverIndex: ", hoverIndex, typeof hoverIndex);
  };

  const handleDragEnd = () => {
    if (draggedIndex === null || hoverIndex === null) return;

    const newSteps = [...stepsData];
    const [movedItem] = newSteps.splice(draggedIndex, 1);
    newSteps.splice(hoverIndex, 0, movedItem);

    setStepsData(newSteps);
    setDraggedIndex(null);
    setHoverIndex(null);
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h2>Guide Creator</h2>
      </div>
      <ul className={styles.sidebarList}>
        {stepsData.map((step, index) => (
          <a
            key={index}
            id={index.toString()}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            href={`#${index.toString()}`}
            style={{
              textDecoration: "none",
              color: "black",
              // cursor: "auto",
              opacity: draggedIndex === index ? 0.5 : 1,
              cursor: "grab",
            }}
          >
            <li
              id={index.toString()}
              key={index}
              className={activeStep === index ? styles.active : ""}
              onClick={() => handleClick(index)}
              style={{
                border: hoverIndex === index ? "2px dashed #2da9e1" : "",
                cursor: draggedIndex === index ? "grabbing" : "grab",
                position: "relative",
                transition: "transform 0.2s, opacity 0.2s",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              {/* {`${index + 1}. ${step.title}`} */}
              {`${index + 1}. ${
                step.title.length > 30
                  ? step.title.substring(0, 30) + "..."
                  : step.title
              }`}
              <span>::: </span>
              {/* <p className={styles.stepDragger}>::</p> */}
            </li>
          </a>
        ))}
      </ul>
    </div>
  );
};
