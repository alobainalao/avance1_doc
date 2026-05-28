import React from "react";

const PageViewer = ({ url }) => {
  return (
    <div 
        style={{
            position: "absolute",
            top: "9vh",
            width: "100%",
            height: "76vh",
        }}

    >
      <iframe
        src={url}
        title="page-viewer"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
      />
    </div>
  );
};

export default PageViewer;