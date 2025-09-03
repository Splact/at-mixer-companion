import React from "react";
import { Button } from "@mui/material";
import "./style.css";

interface MuteButtonProps {
  isMute: boolean;
  onMuteToggle: () => void;
  className?: string;
}

export const MuteButton: React.FC<MuteButtonProps> = ({
  isMute,
  onMuteToggle,
  className = "",
}) => {
  return (
    <Button
      onClick={onMuteToggle}
      className={`control-button mute-button ${
        isMute ? "active" : ""
      } ${className}`}
      size="small"
      variant="outlined"
    >
      M
    </Button>
  );
};
