import React from "react";
import { Slider } from "@mui/material";
import { normalizedToGain, gainToDbString } from "../../utils/naturalGain";

interface VolumeSliderProps {
  volume: number;
  normalizedVolume: number;
  onVolumeChange: (event: Event, newValue: number | number[]) => void;
  showDbValue?: boolean;
  className?: string;
}

export const VolumeSlider: React.FC<VolumeSliderProps> = ({
  volume,
  normalizedVolume,
  onVolumeChange,
  showDbValue = true,
  className = "",
}) => {
  return (
    <div className="volume-control">
      <Slider
        orientation="vertical"
        min={0}
        max={1}
        step={0.01}
        value={normalizedVolume}
        onChange={onVolumeChange}
        className={`volume-slider ${className}`}
      />
      {showDbValue && (
        <div className="volume-value">{gainToDbString(volume)} dB</div>
      )}
    </div>
  );
};
