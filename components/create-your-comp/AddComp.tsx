import React from "react";

function AddComp({
  index,
  addStep,
}: {
  index: number;
  addStep: (
    index: number,
    newTitle: string,
    newDescription: string,
    screenshotUrl: string,
    relativeCoordinates: { x: number; y: number }
  ) => void;
}) {
  function handleAddComp() {
    console.log("AddComp @ index: ", index);
    addStep(
      index,
      "New Step",
      "New Description",
      "https://media.istockphoto.com/id/1458782106/photo/scenic-aerial-view-of-the-mountain-landscape-with-a-forest-and-the-crystal-blue-river-in.jpg?s=612x612&w=0&k=20&c=NXQ_OK6JtmyRRBef8Wd67UZ3scQJKySkXl1ORaActH4=",
      { x: 50, y: 50 }
    );
  }
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      --------------------------
      <button
        style={{
          background: "white",
          // textDecoration: "none",
          // border: "none",
          // color: "gray",
          borderRadius: "50%",
          cursor: "pointer",
        }}
        onClick={() => handleAddComp()}
      >
        Add Step
      </button>
      --------------------------
    </div>
  );
}

export default AddComp;
