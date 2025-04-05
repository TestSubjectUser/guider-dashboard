import React, { useCallback } from "react";
import SCSS from "../moduleStyles/createGuide.module.scss";

export const BlinkingBubble = ({
  coordinates,
  imageRef,
  updateCoordinates,
}: {
  coordinates: { x: number; y: number };
  imageRef: HTMLImageElement | null;
  updateCoordinates: (newCoordinates: { x: number; y: number }) => void;
}) => {
  const [position, setPosition] = React.useState<{ x: number; y: number }>(
    coordinates
  );
  const [dragging, setDragging] = React.useState(false);

  React.useEffect(() => {
    setPosition(coordinates);
  }, [coordinates]);

  React.useEffect(() => {
    if (dragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setDragging(true);
  };

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!dragging || !imageRef) return;

      const imgRect = imageRef.getBoundingClientRect();
      let newX = ((event.clientX - imgRect.left) / imgRect.width) * 100;
      let newY = ((event.clientY - imgRect.top) / imgRect.height) * 100;
      newX = Math.max(0, Math.min(newX, 100));
      newY = Math.max(0, Math.min(newY, 100));

      setPosition({ x: newX, y: newY });
      updateCoordinates({ x: newX, y: newY });
    },
    [coordinates, dragging, imageRef]
  );

  const handleMouseUp = () => {
    setDragging(false);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      className={SCSS.blinkingBubble}
      style={{
        top: `${position.y}%`,
        left: `${position.x}%`,
      }}
    ></div>
  );
};
