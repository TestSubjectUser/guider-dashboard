import React, { useCallback } from "react";
import styles from "./createGuide.module.css";

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
    setPosition(coordinates); // Ensure position updates when props change
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

      // Ensure bubble stays within image boundaries (0% - 100%)
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
      className={styles.blinkingBubble}
      style={{
        top: `${position.y}%`,
        left: `${position.x}%`,
      }}
    ></div>
  );
};

// HANDLING IN FORM OF PIXELS

// import React from "react";
// import styles from "./createGuide.module.css";

// export const BlinkingBubble = ({
//   coordinates,
//   imageRef,
//   updateCoordinates,
// }: {
//   coordinates: { x: number; y: number };
//   imageRef: HTMLImageElement | null;
//   updateCoordinates: (newCoordinates: { x: number; y: number }) => void;
// }) => {
//   const [position, setPosition] = React.useState<{
//     x: number;
//     y: number;
//   } | null>(null);
//   const [dragging, setDragging] = React.useState(false);
//   const bubbleRef = React.useRef<HTMLDivElement | null>(null);
//   const [offset, setOffset] = React.useState({ x: 0, y: 0 });

//   React.useEffect(() => {
//     if (!imageRef) return;

//     const updatePosition = () => {
//       const imageRect = imageRef.getBoundingClientRect();
//       const adjustedX = (imageRect.width * coordinates.x) / 100;
//       const adjustedY = (imageRect.height * coordinates.y) / 100;

//       setPosition({ x: adjustedX, y: adjustedY });
//     };

//     if (imageRef.complete) {
//       updatePosition();
//     } else {
//       imageRef.onload = updatePosition;
//     }
//   }, [imageRef, coordinates]);

//   React.useEffect(() => {
//     if (dragging) {
//       document.addEventListener("mousemove", handleMouseMove);
//       document.addEventListener("mouseup", handleMouseUp);
//     } else {
//       document.removeEventListener("mousemove", handleMouseMove);
//       document.removeEventListener("mouseup", handleMouseUp);
//     }

//     return () => {
//       document.removeEventListener("mousemove", handleMouseMove);
//       document.removeEventListener("mouseup", handleMouseUp);
//     };
//   }, [dragging]);

//   const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
//     if (!bubbleRef.current) return;

//     const rect = bubbleRef.current.getBoundingClientRect();
//     setOffset({
//       x: event.clientX - rect.left,
//       y: event.clientY - rect.top,
//     });

//     setDragging(true);
//   };

//   const handleMouseMove = (event: MouseEvent) => {
//     if (!dragging || !imageRef) return;

//     const imgRect = imageRef.getBoundingClientRect();
//     let newX = event.clientX - imgRect.left - offset.x;
//     let newY = event.clientY - imgRect.top - offset.y;

//     // within image boundaries
//     newX = Math.max(0, Math.min(newX, imgRect.width - 25));
//     newY = Math.max(0, Math.min(newY, imgRect.height - 25));

//     setPosition({ x: newX, y: newY });

//     const percentageX = (newX / imgRect.width) * 100;
//     const percentageY = (newY / imgRect.height) * 100;

//     updateCoordinates({ x: percentageX, y: percentageY });
//   };

//   const handleMouseUp = () => {
//     setDragging(false);
//   };

//   if (!position) return null;

//   return (
//     <div
//       ref={bubbleRef}
//       onMouseDown={handleMouseDown}
//       className={styles.blinkingBubble}
//       style={{
//         top: `${position.y}px`,
//         left: `${position.x}px`,
//       }}
//     ></div>
//   );
// };
