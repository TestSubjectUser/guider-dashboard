import React from "react";

function Header() {
  return (
    <>
      <div className="header">
        {/* <button className="exit-button">Exit</button> */}
        <button className="exit-button"></button>
        <div className="header-buttons">
          {/* <button className="saved-button">Saved</button> */}
          <button className="publish-button">Publish and share</button>
        </div>
      </div>
      <div className="guide-info">
        <h1>Title of the guide</h1>
        <p>What is this guide about?</p>
      </div>
    </>
  );
}

export default Header;
