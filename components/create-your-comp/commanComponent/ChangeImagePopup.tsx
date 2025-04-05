"use client";
import React from "react";
import { ChangeImagePopupProps } from "../utils/types";
import SCSS from "../moduleStyles/createGuide.module.scss";

function ChangeImagePopup({
  oldImageUrl,
  handleImageUpload,
  setShowChangeImagePopup,
  setIsLoading,
}: ChangeImagePopupProps) {
  const imageLink = React.useRef<HTMLInputElement | null>(null);
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

  const handleImageSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setSelectedImage(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async () => {
    setIsLoading(true);
    if (!selectedImage) {
      return;
    }

    try {
      const response = await fetch("/api/aws", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          base64Image: selectedImage,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        try {
          if (
            oldImageUrl.includes("amazonaws") ||
            oldImageUrl.includes("guider-extension")
          ) {
            await fetch("/api/cloudinary", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ imageUrl: oldImageUrl }),
            });
          }
        } catch (error) {
          // TODO: failed to...error toast
        }

        // TODO: success toast
        handleImageUpload(data.imageUrl);
      } else {
        // TODO: failed to...data.error toast
      }
    } catch (error) {
      // TODO: failed to...error toast
    } finally {
      setShowChangeImagePopup(false);
      setIsLoading(false);
    }
  };

  return (
    <div className={SCSS.model}>
      <div className={SCSS.modal}>
        <div className={SCSS.modalHeader}>
          <span>Update image</span>
        </div>
        <div
          className={SCSS.modalBody}
          style={{ display: "flex", flexDirection: "column", gap: "10px" }}
        >
          <input
            type="text"
            placeholder="Enter a valid direct image URL..."
            ref={imageLink}
          />
          <div>OR</div>
          {/* <input type="file" /> */}
          <div>Choose an image to upload</div>
          <input type="file" accept="image/*" onChange={handleImageSelection} />
          {/* <button disabled>Select My Image(coming soon...)</button> */}
        </div>
        <div className={SCSS.modalFooter}>
          <button
            className={SCSS.cancelBtn}
            onClick={() => setShowChangeImagePopup(false)}
          >
            Cancel
          </button>
          <button
            className={SCSS.publishBtn}
            onClick={() => {
              if (imageLink.current!.value) {
                handleImageUpload(imageLink.current!.value);
              } else {
                handleSubmit();
              }
              setShowChangeImagePopup(false);
            }}
          >
            Upload Image
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChangeImagePopup;
