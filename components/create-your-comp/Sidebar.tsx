"use client";
import React, { useState, useEffect, useRef } from "react";
import { data as guideData } from "../../app/data";
import "./index.css";

export const Sidebar = ({
  activeStep,
  handleStepClick,
  stepsData,
}: {
  activeStep: number;
  handleStepClick: (index: number) => void;
  stepsData: any[];
}) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>SideBar | MyDomain</h2>
      </div>
      <ul className="sidebar-list">
        {stepsData.map((step, index) => (
          <li
            key={index}
            className={activeStep === index ? "active" : ""}
            onClick={() => handleStepClick(index)}
          >
            {/* {`${index + 1}. ${step.title}`} */}
            {`${index + 1}. ${step.id}`}
          </li>
        ))}
      </ul>
    </div>
  );
};
