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
              onClick={() => handleStepClick(index)}
            >
              {`${index + 1}. ${step.title}`}
            </li>
          </a>
        ))}
      </ul>
    </div>
  );
};
