import React from "react";
import "./EmptyPage.css";

function EmptyPage() {
  return (
    <div className="empty-page-container">
      <h1>Nothing Here, Chef!</h1>
      <div className="content">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/scan-cuisine-f4b13.appspot.com/o/gif%2Fnothing_here_123456789.gif?alt=media&token=0d3a7920-2faf-45f3-9d3b-8f79026eb20d"
          alt="Nothing here!"
          className="empty-gif"
        ></img>
      </div>
    </div>
  );
}

export default EmptyPage;
