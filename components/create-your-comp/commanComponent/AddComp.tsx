import { AddCompProps } from "../utils/types";
import SCSS from "../moduleStyles/createGuide.module.scss";

function AddComp({ index, addStep }: AddCompProps) {
  function handleAddComp() {
    addStep(
      index,
      "",
      "",
      "https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png",
      null
    );
  }
  return (
    <div
      className={SCSS.addComp}
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <hr style={{ flex: 1, border: "1px solid #ccc", margin: "0 5px" }} />
      <button
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "7px 14px",
          border: "1px solid #ccc",
          borderRadius: "9999px",
          color: "rgb(44, 169, 225)",
          textDecoration: "none",
          margin: "0 5px",
          cursor: "pointer",
        }}
        onClick={() => handleAddComp()}
      >
        Add Step
      </button>
      <hr style={{ flex: 1, border: "1px solid #ccc", margin: "0 5px" }} />
    </div>
  );
}

export default AddComp;
