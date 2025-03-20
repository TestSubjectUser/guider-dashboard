"use client";
import React from "react";
import styles from "./createGuide.module.css";
import { ChangeImagePopupProps } from "./types";

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
      console.log("No image selected.");
      return;
    }

    try {
      const response = await fetch("/api/cloudinary", {
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
        // if image uploaded to s3 than delete older image which was swaped withthis new one....
        try {
          console.log("oldUrl receided in popup: ", oldImageUrl);
          if (
            oldImageUrl.includes("amazonaws") ||
            oldImageUrl.includes("guider-extension")
          ) {
            await fetch("/api/cloudinary", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ imageUrl: oldImageUrl }),
            });

            console.log("Image deleted from AWS");
          }
        } catch (error) {
          console.error("Failed to delete image:", error);
        }

        console.log("Image uploaded to S3 successfully:", data.imageUrl);
        handleImageUpload(data.imageUrl);
        setIsLoading(false);
      } else {
        console.error("Image upload failed:", data.error);
      }
    } catch (error) {
      console.error("Error during image upload:", error);
    } finally {
      setShowChangeImagePopup(false);
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalHeader}>
        <span>Update image</span>
      </div>
      <div
        className={styles.modalBody}
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
      <div className={styles.modalFooter}>
        <button
          className={styles.cancelBtn}
          onClick={() => setShowChangeImagePopup(false)}
        >
          Cancel
        </button>
        <button
          className={styles.publishBtn}
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
  );
}

export default ChangeImagePopup;
