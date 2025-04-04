"use client";
import "../../components/create-your-comp/index.css";
import { useRef, useEffect, useState } from "react";
import styles from "./guide.module.css";
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
      target.scrollIntoView({ behavior: "smooth", block: "start" });
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
    <div className={styles.wrapper}>
      <div className={styles.topNavbar}>
        <div className={styles.navLeft}>
          <button disabled className={styles.navButton}>
            <img
              width="12"
              height="12"
              src="https://img.icons8.com/ios-filled/50/FFFFFF/menu-2.png"
              alt="menu-2"
            />
            crm logo
          </button>
        </div>

        <div className={styles.navRight}>
          <button
            title="to last published version"
            className={styles.navButton}
          >
            Copy link
          </button>

          <button className={`${styles.publishButton}`}>
            get guide creator for free
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2>Guide Steps</h2>
          </div>
          <ul className={styles.sidebarList}>
            {data.guideImages?.map((step, index) => (
              <div key={index}>
                {index === 0 && (
                  <h4 className={styles.tabTitle}>{step.tabTitle}</h4>
                )}
                {index > 0 &&
                  data.guideImages[index - 1].tabTitle !== step.tabTitle && (
                    <h4 className={styles.tabTitle}>{step.tabTitle}</h4>
                  )}
                <li
                  key={index}
                  className={activeStep === index ? styles.active : ""}
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

        <main className={styles.container}>
          <h1 className={styles.guideTitle}>{data.guideTitle}</h1>
          <p className={styles.guideDescription}>{data.guideDescription}</p>
          <div className={styles.stepsContainer}>
            {data.guideImages?.map((image, index) => (
              <div
                key={index}
                ref={(el) => {
                  stepRefs.current[index] = el;
                }}
                className={styles.stepContainer}
              >
                <div className={styles.titleIndex}>
                  <p className={styles.imageIndex}>{index + 1}</p>
                  <p className={styles.imageTitle}>{image.title}</p>
                </div>
                <p className={styles.imageDescription}>{image.description}</p>
                {image.screenshotUrl && (
                  <div
                    className={styles.imageWrapper}
                    style={{ position: "relative" }}
                  >
                    <div className={styles.stepImage}>
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
                          className={styles.bubble}
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
