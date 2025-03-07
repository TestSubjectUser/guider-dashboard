import React from "react";

function Header() {
  return (
    <div className="header">
      <button className="exit-button">Exit</button>
      <div className="header-buttons">
        <button className="saved-button">Saved</button>
        <button className="publish-button">Publish and share</button>
      </div>
    </div>
  );
}

export default Header;
