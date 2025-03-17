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
        <button disabled>Select My Image(coming soon...)</button>
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
            console.log("imageLink.current!.value", imageLink.current!.value);
            handleImageUpload(imageLink.current!.value);
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
