"use client";
import React, { useState, useEffect, useRef } from "react";
import { data as guideData } from "../../app/data";
import "./index.css";

export const Sidebar = ({
  activeStep,
  handleStepClick,
}: {
  activeStep: number;
  handleStepClick: (index: number) => void;
}) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>SideBar | MyDomain</h2>
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
  );
};
