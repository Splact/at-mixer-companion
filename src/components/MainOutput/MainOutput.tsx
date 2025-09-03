import React from "react";
import "./style.css";

interface MainOutputProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export const MainOutput: React.FC<MainOutputProps> = ({
  volume,
  onVolumeChange,
}) => {
  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    onVolumeChange(newVolume);
  };

  return (
    <div className="main-output">
      <div className="main-output-label">MAIN OUT</div>
      <div className="main-output-color"></div>
      <div className="volume-control">
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
          className="volume-slider main-volume"
        />
        <div className="volume-value">{Math.round(volume)}%</div>
      </div>
    </div>
  );
};
