import React from "react";
import "./style.css";

interface LoadingScreenProps {
  error?: string;
}

export function LoadingScreen({ error }: LoadingScreenProps) {
  return (
    <div className="App">
      <div className="pat-form-container">
        <h1>AT Mixer Companion</h1>
        <p>Initializing Audiotool client...</p>
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
}
