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
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null
  );
  const [dragging, setDragging] = useState(false);
  const bubbleRef = useRef<HTMLDivElement | null>(null);
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

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!bubbleRef.current) return;

    const rect = bubbleRef.current.getBoundingClientRect();
    setOffset({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });

    setDragging(true);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!dragging || !imageRef) return;

    const imgRect = imageRef.getBoundingClientRect();
    let newX = event.clientX - imgRect.left - offset.x;
    let newY = event.clientY - imgRect.top - offset.y;

    // within image boundaries
    newX = Math.max(0, Math.min(newX, imgRect.width - 25));
    newY = Math.max(0, Math.min(newY, imgRect.height - 25));

    setPosition({ x: newX, y: newY });

    const percentageX = (newX / imgRect.width) * 100;
    const percentageY = (newY / imgRect.height) * 100;

    updateCoordinates({ x: percentageX, y: percentageY });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    if (dragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  if (!position) return null;

  return (
    <div
      ref={bubbleRef}
      onMouseDown={handleMouseDown}
      style={{
        position: "absolute",
        top: `${position.y}px`,
        left: `${position.x}px`,
        width: "25px",
        height: "25px",
        backgroundColor: "rgba(255, 0, 0, 0.5)",
        borderRadius: "50%",
        animation: "blink 1s infinite",
        transform: "translate(-50%, -50%)",
        zIndex: 10,
        cursor: "grab",
      }}
    ></div>
  );
};
