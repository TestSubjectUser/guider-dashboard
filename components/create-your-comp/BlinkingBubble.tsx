import { useEffect, useState } from "react";

export const BlinkingBubble = ({
  coordinates,
  imageRef,
}: {
  coordinates: { x: number; y: number };
  imageRef: HTMLImageElement | null;
}) => {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null
  );

  useEffect(() => {
    if (!imageRef) return;

    const updatePosition = () => {
      const imageRect = imageRef.getBoundingClientRect();
      const adjustedX = (imageRect.width * coordinates.x) / 100;
      const adjustedY = (imageRect.height * coordinates.y) / 100;

      setPosition({ x: adjustedX, y: adjustedY });
    };

    // Ensure the image is fully loaded before calculating
    if (imageRef.complete) {
      updatePosition();
    } else {
      imageRef.onload = updatePosition;
    }
  }, [imageRef, coordinates]);

  if (!position) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: `${position.y}px`,
        left: `${position.x}px`,
        width: "30px",
        height: "30px",
        backgroundColor: "rgba(255, 0, 0, 0.5)",
        borderRadius: "50%",
        animation: "blink 1s infinite",
        transform: "translate(-50%, -50%)",
        zIndex: 10,
      }}
    ></div>
  );
};
