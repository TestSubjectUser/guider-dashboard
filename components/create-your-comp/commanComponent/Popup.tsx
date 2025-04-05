import SCSS from "../moduleStyles/createGuide.module.scss";

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
    <div className={SCSS.model}>
      <div className={SCSS.modal}>
        <div className={SCSS.modalHeader}>
          <span>Publish guide</span>
        </div>
        <div className={SCSS.modalBody}>
          <p>Who can see this guide?</p>
          <label>
            <input type="radio" name="visibility" defaultChecked />
            <span>Anyone with a link</span>
          </label>
          {/* <label>
        <input type="radio" name="visibility" />
        <span>Only users within my HubSpot account</span>
      </label> */}
          <div className={SCSS.linkModel}>
            <div className={SCSS.linkContainer}>
              <input type="text" value={popupUrl} readOnly />
            </div>
            <div className={SCSS.copyLinkContainer}>
              <button className={SCSS.copyLinkBtn} onClick={copyToClipboard}>
                Copy link
              </button>
            </div>
          </div>
        </div>
        <div className={SCSS.modalFooter}>
          <button className={SCSS.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          {/* redirect to final guide page OR ... */}
          <button className={SCSS.publishBtn} onClick={visitGuide}>
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
