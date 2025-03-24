import React from "react";

function ShimmerStepLoader() {
  return (
    <div
      style={{
        position: "relative",
        backgroundColor: "#ffffff",
        padding: "24px",
        borderRadius: "8px",
        boxShadow: "0 0px 7px rgba(0, 0, 0, 0.1)",
        margin: "10px 0",
        height: "50vh",
        maxHeight: "500px",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          borderRadius: "5px",
          height: "25px",
          width: "80%",
          background:
            "linear-gradient(90deg, #f3efef 25%, #e0e0e0 50%, #f3efef 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s infinite linear",
        }}
      ></div>

      <div
        style={{
          borderRadius: "5px",
          height: "20px",
          width: "70%",
          background:
            "linear-gradient(90deg, #f3efef 25%, #e0e0e0 50%, #f3efef 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s infinite linear",
        }}
      ></div>

      <div
        style={{
          height: "100%",
          width: "100%",
          borderRadius: "8px",
          background:
            "linear-gradient(90deg, #f3efef 25%, #e0e0e0 50%, #f3efef 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s infinite linear",
        }}
      ></div>

      <style>
        {`
@keyframes shimmer {
0% {
  background-position: -200% 0;
}
100% {
  background-position: 200% 0;
}
}
`}
      </style>
    </div>
  );
}

export default ShimmerStepLoader;
