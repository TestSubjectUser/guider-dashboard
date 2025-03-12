import { useEffect, useRef, useState } from "react";

export const BlinkingBubble = ({
  coordinates,
  imageRef,
  updateCoordinates,
}: {
  coordinates: { x: number; y: number };
  imageRef: HTMLImageElement | null;
  updateCoordinates: (newCoordinates: { x: number; y: number }) => void;
}) => {
  // in pixels
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null
  );
  const [percPosition, setPercPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const bubbleRef = useRef<HTMLDivElement | null>(null); // Reference to bubble
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!imageRef) return;

    const updatePosition = () => {
      const imageRect = imageRef.getBoundingClientRect();
      const adjustedX = (imageRect.width * coordinates.x) / 100;
      const adjustedY = (imageRect.height * coordinates.y) / 100;

      setPosition({ x: adjustedX, y: adjustedY });
    };

    if (imageRef.complete) {
      updatePosition();
    } else {
      imageRef.onload = updatePosition;
    }
  }, [imageRef, coordinates]);

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    if (bubbleRef.current) {
      const rect = bubbleRef.current.getBoundingClientRect();
      setOffset({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    }
    setDragging(true);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); // Required to allow dragging

    if (dragging && imageRef) {
      const imgRect = imageRef.getBoundingClientRect();
      let newX = event.clientX - imgRect.left - offset.x;
      let newY = event.clientY - imgRect.top - offset.y;

      // Keep the bubble within image boundaries
      newX = Math.max(0, Math.min(newX, imgRect.width));
      newY = Math.max(0, Math.min(newY, imgRect.height));

      // - in pixels
      setPosition({ x: newX, y: newY });

      const percentageX = (newX / imgRect.width) * 100;
      const percentageY = (newY / imgRect.height) * 100;
      setPercPosition({ x: percentageX, y: percentageY });
      // console.log("Bubble Position (Percentage):", {
      //   x: percentageX,
      //   y: percentageY,
      // });
    }
  };

  const handleDragEnd = () => {
    setDragging(false);
    console.log("Drag ended, Position", percPosition);
    updateCoordinates(percPosition!);
  };

  if (!position) return null;

  return (
    <div
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
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
