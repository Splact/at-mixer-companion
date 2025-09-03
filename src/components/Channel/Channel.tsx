import React from "react";
import "./style.css";

interface ChannelProps {
  name: string;
  color: string;
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export const Channel: React.FC<ChannelProps> = ({
  name,
  color,
  volume,
  onVolumeChange,
}) => {
  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    onVolumeChange(newVolume);
  };

  return (
    <div className="channel">
      <div className="channel-name">{name}</div>
      <div className="channel-color" style={{ backgroundColor: color }}></div>
      <div className="volume-control">
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
          className="volume-slider"
        />
        <div className="volume-value">{Math.round(volume)}%</div>
      </div>
    </div>
  );
};
