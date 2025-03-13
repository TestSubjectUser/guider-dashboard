"use client";
import { useEffect, useRef, useState } from "react";

interface ImageWithBlinkingBubbleProps {
  imageUrl: string;
  relativeCoordinates: { x: number; y: number };
}

const ImageWithBlinkingBubble: React.FC<ImageWithBlinkingBubbleProps> = ({
  imageUrl,
  relativeCoordinates,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [opacity, setOpacity] = useState(1);
  const [isFadingOut, setIsFadingOut] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const image = new Image();
    image.src = imageUrl;

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0, image.width, image.height);
      drawBlinkingBubble(ctx, image.width, image.height);
    };

    const drawBlinkingBubble = (
      ctx: CanvasRenderingContext2D,
      imgWidth: number,
      imgHeight: number
    ) => {
      const x = (relativeCoordinates.x / 100) * imgWidth;
      const y = (relativeCoordinates.y / 100) * imgHeight;

      const drawBubble = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, image.width, image.height);

        ctx.globalAlpha = opacity;
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.globalAlpha = 1;
      };

      const animateBlinking = () => {
        setOpacity((prevOpacity) => {
          if (isFadingOut) {
            if (prevOpacity > 0.2) {
              return prevOpacity - 0.05;
            } else {
              setIsFadingOut(false);
              return prevOpacity;
            }
          } else {
            if (prevOpacity < 1) {
              return prevOpacity + 0.05;
            } else {
              setIsFadingOut(true);
              return prevOpacity;
            }
          }
        });

        drawBubble();
        requestAnimationFrame(animateBlinking);
      };

      animateBlinking();
    };
  }, [imageUrl, relativeCoordinates]);

  return (
    <div style={{ textAlign: "center" }}>
      <canvas ref={canvasRef} style={{ maxWidth: "100%", height: "auto" }} />
    </div>
  );
};

export default ImageWithBlinkingBubble;
