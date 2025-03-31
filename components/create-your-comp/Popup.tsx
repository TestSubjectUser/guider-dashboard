import styles from "./createGuide.module.css";

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
    <div className={styles.model}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <span>Publish guide</span>
        </div>
        <div className={styles.modalBody}>
          <p>Who can see this guide?</p>
          <label>
            <input type="radio" name="visibility" defaultChecked />
            <span>Anyone with a link</span>
          </label>
          {/* <label>
        <input type="radio" name="visibility" />
        <span>Only users within my HubSpot account</span>
      </label> */}
          <div className={styles.linkModel}>
            <div className={styles.linkContainer}>
              <input type="text" value={popupUrl} readOnly />
            </div>
            <div className={styles.copyLinkContainer}>
              <button className={styles.copyLinkBtn} onClick={copyToClipboard}>
                Copy link
              </button>
            </div>
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          {/* redirect to final guide page OR ... */}
          <button className={styles.publishBtn} onClick={visitGuide}>
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
