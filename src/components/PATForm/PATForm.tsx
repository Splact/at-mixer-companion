import React, { useState } from "react";
import "./style.css";

interface PATFormProps {
  onSubmit: (pat: string) => Promise<void>;
  isLoading: boolean;
  error: string;
}

export function PATForm({ onSubmit, isLoading, error }: PATFormProps) {
  const [audiotoolPAT, setAudiotoolPAT] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audiotoolPAT.trim()) {
      return;
    }
    await onSubmit(audiotoolPAT);
  };

  return (
    <div className="pat-form-container">
      <h1>AT Mixer Companion</h1>
      <p>Please enter your Audiotool Personal Access Token to continue</p>

      <form onSubmit={handleSubmit} className="pat-form">
        <div className="form-group">
          <label htmlFor="pat-input">Audiotool PAT:</label>
          <input
            id="pat-input"
            type="password"
            value={audiotoolPAT}
            onChange={(e) => setAudiotoolPAT(e.target.value)}
            placeholder="Enter your Personal Access Token"
            disabled={isLoading}
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button
          type="submit"
          disabled={isLoading || !audiotoolPAT.trim()}
          className="submit-button"
        >
          {isLoading ? "Setting PAT..." : "Continue"}
        </button>
      </form>

      <div className="help-text">
        <p>
          <strong>How to get your PAT:</strong>
        </p>
        <ol>
          <li>
            Go to{" "}
            <a
              href="https://www.audiotool.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              audiotool.com
            </a>
          </li>
          <li>Log in to your account</li>
          <li>Navigate to your profile settings</li>
          <li>Generate a new Personal Access Token</li>
        </ol>
      </div>
    </div>
  );
}
