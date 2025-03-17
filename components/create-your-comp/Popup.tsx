import React from "react";

function Popup({
  popupUrl,
  onClose,
}: {
  popupUrl: string;
  onClose: () => void;
}) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(popupUrl);
    alert("Link copied to clipboard!");
  };
  const visitGuide = () => {
    window.open(popupUrl, "_blank");
  };

  return (
    <div className="model">
      <div className="modal">
        <div className="modal-header">
          <span>Publish guide</span>
          <i className="fas fa-times" onClick={onClose}></i>
        </div>
        <div className="modal-body">
          <p>Who can see this guide?</p>
          <label>
            <input type="radio" name="visibility" defaultChecked />
            <span>Anyone with a link</span>
          </label>
          {/* <label>
            <input type="radio" name="visibility" />
            <span>Only users within my HubSpot account</span>
          </label> */}
          <div className="link-model">
            <div className="link-container">
              <input type="text" value={popupUrl} readOnly />
            </div>
            <div className="copy-link-container">
              <button className="copy-link-btn" onClick={copyToClipboard}>
                Copy link
              </button>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          {/* redirect to final guide page OR ... */}
          <button className="publish-btn" onClick={visitGuide}>
            Visit guide
          </button>
        </div>
      </div>
    </div>
    // ,
    // // document.getElementById("popup") as HTMLElement
    // document.querySelector(".popup") as HTMLElement
  );
}

export default Popup;
