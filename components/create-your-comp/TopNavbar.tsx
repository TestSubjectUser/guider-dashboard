import styles from "./moduleStyles/TopNavbar.module.css";

function TopNavbar({ isLoading, handleGuidetitleordescPublish }: any) {
  return (
    <>
      <div className={styles.topNavbar}>
        <div className={styles.navLeft}>
          <button disabled className={styles.navButton}>
            Exit
          </button>
          <button disabled className={styles.navButton}>
            <img
              width="12"
              height="12"
              src="https://img.icons8.com/ios-filled/50/FFFFFF/menu-2.png"
              alt="menu-2"
            />
          </button>
        </div>

        <div className={styles.navRight}>
          <div className={styles.navTitle}>Guide Creator</div>
          <button
            title="to last published version"
            className={styles.navButton}
            onClick={() => window.location.reload()}
          >
            Revert Changes
          </button>
          {/* <button className={styles.navButton}>Button 4</button> */}
          <button
            disabled={isLoading}
            className={`${styles.publishButton} ${
              isLoading ? styles.disabled : ""
            }`}
            onClick={handleGuidetitleordescPublish}
          >
            {isLoading ? "Updating..." : "Publish and share"}
          </button>
        </div>
      </div>
      <div className={styles.mobileActionButtons}>
        <button
          style={{
            marginRight: "5px",
          }}
          title="to last published version"
          className={styles.navButton}
          onClick={() => window.location.reload()}
        >
          Revert Changes
        </button>

        <button
          disabled={isLoading}
          className={`${styles.publishButton} ${
            isLoading ? styles.disabled : ""
          }`}
          onClick={handleGuidetitleordescPublish}
        >
          {isLoading ? "Updating..." : "Publish and share"}
        </button>
      </div>
    </>
  );
}

export default TopNavbar;
