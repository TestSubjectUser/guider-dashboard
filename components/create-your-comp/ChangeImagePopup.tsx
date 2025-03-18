"use client";
import React from "react";

function ChangeImagePopup({
  handleImageUpload,
  setShowChangeImagePopup,
}: {
  handleImageUpload: (imageLink: string) => void;
  //   setPopupChangeImageUrl: React.Dispatch<React.SetStateAction<string>>;
  setShowChangeImagePopup: React.Dispatch<React.SetStateAction<boolean>>;
}) {
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
        console.log("Image uploaded to S3 successfully:", data.imageUrl);
        handleImageUpload(data.imageUrl);
      } else {
        console.error("Image upload failed:", data.error);
      }
    } catch (error) {
      console.error("Error during image upload:", error);
    } finally {
      setShowChangeImagePopup(false);
    }
  };

  return (
    // <div className="model">
    <div className="modal">
      <div className="modal-header">
        <span>Update image</span>
      </div>
      <div
        className="modal-body"
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <input
          type="text"
          placeholder="Entre a valid direct image url..."
          ref={imageLink}
        />
        <div>OR</div>
        {/* <input type="file" /> */}
        <div>Choose an image to upload</div>
        <input type="file" accept="image/*" onChange={handleImageSelection} />
        {/* <button disabled>Select My Image(coming soon...)</button> */}
      </div>
      <div className="modal-footer">
        <button
          className="cancel-btn"
          onClick={() => setShowChangeImagePopup(false)}
        >
          Cancel
        </button>
        <button
          className="publish-btn"
          onClick={() => {
            // console.log("imageLink.current!.value", imageLink.current!.value);
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
      {/* </div> */}
    </div>
  );
}

export default ChangeImagePopup;
