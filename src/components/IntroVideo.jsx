import React, { useState } from "react";
import VideoCard from "./VideoCard";

export default function IntroVideo() {
  const [show, setShow] = useState(true);

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0, 0, 0, 0.88)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "10px",
        zIndex: 999999,
      }}
    >
      {/* Close Button */}
      <button
        onClick={() => setShow(false)}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          background: "#fff",
          border: "none",
          padding: "6px 12px",
          borderRadius: "50%",
          fontSize: "18px",
          cursor: "pointer",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
        }}
      >
        ✕
      </button>

      <div
        style={{
          
          width: "90%",
          maxWidth: "300px",        // medium size
          display: "flex",
          justifyContent: "center",
        }}
      >
        <VideoCard />
      </div>
    </div>
  );
}
