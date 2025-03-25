import styles from "./moduleStyles/Step.module.css";

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
    <div className={styles.tooltip}>
      {/* set state to false onClick as well */}
      {step.screenshotUrl ? (
        <>
          <button
            onClick={() => {
              setShowTooltip((prev) => !prev);
              // console.log("Remove Image");
              if (step.screenshotUrl) {
                handleRemoveImage(step.screenshotUrl);
                updateStep(index, step.title, step.description, null, null);
              }
            }}
          >
            Remove Image
            <img
              width="20"
              height="20"
              src="https://img.icons8.com/material-rounded/24/FFFFFF/remove-image.png"
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
                // console.log("Remove Bubble");
              }}
            >
              Remove Bubble
              <img
                width="20"
                height="20"
                src="https://img.icons8.com/ios-filled/50/FFFFFF/circled-x.png"
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
                // console.log("Add Bubble");
              }}
            >
              Add Bubble
              <img
                width="20"
                height="20"
                src="https://img.icons8.com/ios-filled/50/FFFFFF/circled.png"
                alt="circled"
              />
            </button>
          )}
        </>
      ) : (
        <button
          onClick={() => {
            setShowTooltip((prev) => !prev);
            // console.log("Add Image");
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
          <img
            width="20"
            height="20"
            src="https://img.icons8.com/material-rounded/24/FFFFFF/add-image.png"
            alt="add-image"
          />
        </button>
      )}
    </div>
  );
}

export default ToolTip;
