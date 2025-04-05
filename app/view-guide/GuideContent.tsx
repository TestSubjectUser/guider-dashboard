"use client";
import "../../components/create-your-comp/index.css";
import { useRef, useEffect, useState } from "react";
import SCSS from "./guide.module.scss";
import { GuideDataProps } from "@/components/create-your-comp/utils/types";

interface Props {
  data: GuideDataProps;
}

export default function GuideContent({ data }: Props) {
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeStep, setActiveStep] = useState(0);

  const handleScrollToStep = (index: number) => {
    const target = stepRefs.current[index];
    if (target) {
      const elementPosition = target.offsetTop - 51;

      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      stepRefs.current.forEach((ref, index) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
            setActiveStep(index);
          }
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <div className={SCSS.topNavbar}>
        <div className={SCSS.navLeft}>
          <button disabled className={SCSS.navButton}>
            <img
              width="12"
              height="12"
              src="https://img.icons8.com/ios-filled/50/FFFFFF/menu-2.png"
              alt="menu-2"
            />
            crm logo
          </button>
        </div>

        <div className={SCSS.navRight}>
          <button title="to last published version" className={SCSS.navButton}>
            Copy link
          </button>

          <button className={`${SCSS.publishButton}`}>
            get guide creator for free
          </button>
        </div>
      </div>

      <div className={SCSS.content}>
        <aside className={SCSS.sidebar}>
          <div className={SCSS.sidebarHeader}>
            <h2>Guide Steps</h2>
          </div>
          <ul className={SCSS.sidebarList}>
            {data.guideImages?.map((step, index) => (
              <div key={index}>
                {index === 0 && (
                  <h4 className={SCSS.tabTitle}>{step.tabTitle}</h4>
                )}
                {index > 0 &&
                  data.guideImages[index - 1].tabTitle !== step.tabTitle && (
                    <h4 className={SCSS.tabTitle}>{step.tabTitle}</h4>
                  )}
                <li
                  key={index}
                  className={activeStep === index ? SCSS.active : ""}
                  onClick={() => handleScrollToStep(index)}
                >
                  {`${index + 1}. ${
                    step.title.length > 30
                      ? step.title.substring(0, 30) + "..."
                      : step.title
                  }`}
                </li>
              </div>
            ))}
          </ul>
        </aside>

        <main className={SCSS.container}>
          <h1 className={SCSS.guideTitle}>{data.guideTitle}</h1>
          <p className={SCSS.guideDescription}>{data.guideDescription}</p>
          <div className={SCSS.stepsContainer}>
            {data.guideImages?.map((image, index) => (
              <div
                id={`step-${index}`}
                key={index}
                ref={(el) => {
                  stepRefs.current[index] = el;
                }}
                className={SCSS.stepContainer}
              >
                <div className={SCSS.titleIndex}>
                  <p className={SCSS.imageIndex}>{index + 1}</p>
                  <p className={SCSS.imageTitle}>{image.title}</p>
                </div>
                <p className={SCSS.imageDescription}>{image.description}</p>
                {image.screenshotUrl && (
                  <div
                    className={SCSS.imageWrapper}
                    style={{ position: "relative" }}
                  >
                    <div className={SCSS.stepImage}>
                      <img
                        src={image.screenshotUrl}
                        alt={image.title}
                        style={{
                          maxWidth: "75vw",
                          objectFit: "contain",
                          maxHeight: "450px",
                          transition: "transform 0.5s ease-out",
                          transform: `scale(${image.scale ?? 1})`,
                          transformOrigin: `${image.relativeCoordinates?.x}% ${image.relativeCoordinates?.y}%`,
                        }}
                      />
                      {image.relativeCoordinates && (
                        <div
                          className={SCSS.bubble}
                          style={{
                            top: `${image.relativeCoordinates.y}%`,
                            left: `${image.relativeCoordinates.x}%`,
                          }}
                        ></div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
