import React from "react";
import "./style.css";

interface AppHeaderProps {
  onResetPAT: () => void;
}

export function AppHeader({ onResetPAT }: AppHeaderProps) {
  return (
    <div className="header">
      <h1>AT Mixer Companion</h1>
      <button onClick={onResetPAT} className="reset-button">
        Change PAT
      </button>
    </div>
  );
}
