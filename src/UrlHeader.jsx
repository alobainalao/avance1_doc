// UrlHeader.jsx

import React from "react";

const UrlHeader = ({ url }) => {
  return (
    <div
        style={{
            position: "absolute",
            top: "14px",
            right: "24px",

            display: "flex",
            alignItems: "center",
            gap: "10px",

            padding: "10px 18px",

            
        }}
        >
        <span
            style={{
            fontSize: "16px",
            filter: "drop-shadow(0 0 6px rgba(0,255,255,0.6))",
            }}
        >
            🌐
        </span>

        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
            color: "#c9f3ff",
            textDecoration: "none",

            fontSize: "14px",
            fontWeight: 500,
            letterSpacing: "0.2px",

            maxWidth: "340px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            }}
        >
            {url.replace("https://", "")}
        </a>
    </div>
  );
};

export default UrlHeader;