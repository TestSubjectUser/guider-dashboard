import SCSS from "./moduleStyles/TopNavbar.module.scss";

function TopNavbar({
  isLoading,
  handleGuidetitleordescPublish,
}: {
  isLoading: boolean;
  handleGuidetitleordescPublish: () => void;
}) {
  return (
    <>
      <div className={SCSS.topNavbar}>
        <div className={SCSS.navLeft}>
          <button
            className={SCSS.navButton}
            title="copy view-guide link"
            onClick={(event) => {
              navigator.clipboard.writeText(
                window.location.href.replace("dashboard", "view-guide")
              );
              const button = event.currentTarget;
              const originalText = button.innerText;

              button.innerText = "Copied!";
              setTimeout(() => {
                button.innerText = originalText;
              }, 500);
            }}
          >
            Copy Guide Link
          </button>
          <button disabled className={SCSS.navButton}>
            <img
              width="12"
              height="12"
              src="https://img.icons8.com/ios-filled/50/FFFFFF/menu-2.png"
              alt="menu-2"
            />
          </button>
        </div>

        <div className={SCSS.navRight}>
          <div className={SCSS.navTitle}>Guide Creator</div>
          <button
            title="to last published version"
            className={SCSS.navButton}
            onClick={() => window.location.reload()}
          >
            Revert Changes
          </button>
          {/* <button className={SCSS.navButton}>Button 4</button> */}
          <button
            disabled={isLoading}
            className={`${SCSS.publishButton} ${
              isLoading ? SCSS.disabled : ""
            }`}
            onClick={handleGuidetitleordescPublish}
          >
            {isLoading ? "Updating..." : "Publish and share"}
          </button>
        </div>
      </div>
      <div className={SCSS.mobileActionButtons}>
        <button
          style={{
            marginRight: "5px",
          }}
          title="to last published version"
          className={SCSS.navButton}
          onClick={() => window.location.reload()}
        >
          Revert Changes
        </button>

        <button
          disabled={isLoading}
          className={`${SCSS.publishButton} ${isLoading ? SCSS.disabled : ""}`}
          onClick={handleGuidetitleordescPublish}
        >
          {isLoading ? "Updating..." : "Publish and share"}
        </button>
      </div>
    </>
  );
}

export default TopNavbar;
