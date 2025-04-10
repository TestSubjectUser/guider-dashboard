import Image from "next/image";
import SCSS from "../moduleStyles/Step.module.scss";

function ToolTip({
  setShowTooltip,
  handleRemoveImage,
  updateStep,
  step,
  index,
}: {
  setShowTooltip: React.Dispatch<React.SetStateAction<boolean>>;
  handleRemoveImage: (imageUrl: string) => Promise<void>;
  updateStep: (
    index: number,
    newTitle: string,
    newDescription: string,
    newCoordinates: { x: number; y: number } | null,
    newScreenshotUrl: string | null,
    scale?: number
  ) => void;
  step: {
    title: string;
    description: string;
    screenshotUrl: string | null;
    relativeCoordinates: { x: number; y: number } | null;
    scale: number;
  };
  index: number;
}) {
  return (
    <div className={SCSS.tooltip}>
      {step.screenshotUrl ? (
        <>
          <button
            onClick={() => {
              setShowTooltip((prev) => !prev);
              if (step.screenshotUrl) {
                handleRemoveImage(step.screenshotUrl);
                updateStep(index, step.title, step.description, null, null);
              }
            }}
          >
            Remove Image
            <Image
              width="20"
              height="20"
              src="/assets/remove-image.png"
              alt="remove-image"
            />
          </button>
          {step.relativeCoordinates ? (
            <button
              onClick={() => {
                setShowTooltip((prev) => !prev);
                updateStep(
                  index,
                  step.title,
                  step.description,
                  null,
                  step.screenshotUrl
                );
              }}
            >
              Remove Bubble
              <Image
                width="20"
                height="20"
                src="/assets/circled-x.png"
                alt="circled-x"
              />
            </button>
          ) : (
            <button
              onClick={() => {
                setShowTooltip((prev) => !prev);
                if (!step.relativeCoordinates)
                  updateStep(
                    index,
                    step.title,
                    step.description,
                    {
                      x: 50,
                      y: 50,
                    },
                    step.screenshotUrl,
                    1
                  );
              }}
            >
              Add Bubble
              <Image
                width="20"
                height="20"
                src="/assets/circled.png"
                alt="circled"
              />
            </button>
          )}
        </>
      ) : (
        <button
          onClick={() => {
            setShowTooltip((prev) => !prev);
            updateStep(
              index,
              step.title,
              step.description,
              {
                x: 50,
                y: 50,
              },
              "https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png"
            );
          }}
        >
          Add Image
          <Image
            width="20"
            height="20"
            src="/assets/add-image.png"
            alt="add-image"
          />
        </button>
      )}
    </div>
  );
}

export default ToolTip;
