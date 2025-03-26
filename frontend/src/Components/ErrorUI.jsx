import React from "react";

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert" style={{ padding: "20px", border: "1px solid red", backgroundColor: "#ffe6e6" }}>
      <h2>Something went wrong!</h2>
      <p style={{ color: "red" }}>Something went wrong</p>
      <button onClick={resetErrorBoundary}>Try Again</button>
    </div>
  );
}

export default ErrorFallback;