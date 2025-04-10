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
          <button className={SCSS.navLogo}>
            <img
              alt="CrmOne Logo"
              loading="lazy"
              width="35"
              // height="48"
              decoding="async"
              data-nimg="1"
              className={SCSS.navLogo}
              // srcset="https://cdnf.prospectconnect.ai/assets/images/logos/crmonelogo.svg?w=128&amp;q=75 1x, https://cdnf.prospectconnect.ai/assets/images/logos/crmonelogo.svg?w=256&amp;q=75 2x"
              src="https://cdnf.prospectconnect.ai/assets/images/logos/crmonelogo.svg?w=256&amp;q=75"
              // style="color: transparent;"
            />
          </button>
        </div>

        <div className={SCSS.navRight}>
          <button
            className={SCSS.navButton}
            title="copy view-guide link"
            onClick={(event) => {
              navigator.clipboard.writeText(window.location.href);
              const button = event.currentTarget;
              const originalText = button.innerText;

              button.innerText = "Copied!";
              setTimeout(() => {
                button.innerText = originalText;
              }, 500);
            }}
          >
            Copy Guide Link
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
          <p className={SCSS.lastUpdated}>
            Last updated: {new Date(data.timestamp).toDateString()}
          </p>
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
                      <div
                        style={{
                          position: "relative",
                          display: "inline-block",
                        }}
                      >
                        <img
                          src={image.screenshotUrl}
                          alt={image.title}
                          style={{
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
                  </div>
                )}
              </div>
            ))}
            <div className={SCSS.getStartedContainer}>
              Create your own step-by-step guide for free with Guide Creator
              <button className={SCSS.getStarted}>
                <p>Get Started</p>
                <svg
                  aria-label="Link opens in a new window"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  focusable="false"
                  data-icon-name="ExternalLink"
                  className={SCSS.svgIcon}
                >
                  <path d="M26.91 5.78c-.07-.16-.16-.3-.28-.41a1.1 1.1 0 0 0-.4-.27c-.14-.06-.3-.09-.47-.09h-7.72c-.7 0-1.26.56-1.27 1.26 0 .7.57 1.27 1.27 1.27h4.64L11.86 18.35a1.272 1.272 0 0 0 1.8 1.8L24.47 9.34v4.64c0 .7.57 1.27 1.27 1.27s1.27-.57 1.27-1.27V6.27c0-.17-.03-.33-.09-.47Zm-4.57 11.91c-.7 0-1.27.57-1.27 1.27v5.15c0 .19-.16.35-.35.35H7.89c-.19 0-.35-.16-.35-.35V11.27c0-.19.16-.35.35-.35h5.15c.7 0 1.27-.57 1.27-1.27s-.57-1.27-1.27-1.27H7.89c-1.59 0-2.88 1.3-2.89 2.89v12.84a2.9 2.9 0 0 0 2.89 2.9h12.86c1.6 0 2.9-1.3 2.9-2.9v-5.14c0-.7-.57-1.27-1.27-1.27h-.03Z"></path>
                </svg>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
