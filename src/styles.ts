const headStyles = `
    pre {
      word-break: break-all;
      background-color: #2b2b2b;
      border-radius: 10px;
      padding: 16px;
      font-size: 15px;
      white-space: pre-wrap !important;
      overflow-wrap: break-word !important;
      color: #fff !important;
    }
    
    body {
      scroll-behavior: smooth;
      overflow: hidden;
    }
    
    pre:hover {
      background-color: black;
    }
    
    .rendered-markdown {
      font-size: 16px;
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    }
  `;

const injectStyles = () => {
  const style = document.createElement("style");
  style.textContent = headStyles;
  document.head.appendChild(style);
};
export { headStyles, injectStyles };
