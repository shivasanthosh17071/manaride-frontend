import React from "react";

export default function VideoCard() {
  return (
    <div
      className="d-flex justify-content-center align-items-center mb-4"
      style={{
        background: "#f8f9fa",
        padding: "5px",
        borderRadius: "14px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        width: "100%",
        maxWidth: "650px",
        margin: "0 auto",
      }}
    >
      <video
        src="/commingsoon.mp4"
        autoPlay
        loop
        muted
        playsInline
        controls={false}
        style={{
          width: "100%",
          borderRadius: "10px",
          outline: "none",
          pointerEvents: "none",   // user cannot click or pause
        }}
      />
    </div>
  );
}
