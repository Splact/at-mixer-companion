import React, { useState } from "react";
import { Channel } from "../Channel";
import { MainOutput } from "../MainOutput";
import "./style.css";

interface ChannelData {
  id: number;
  name: string;
  color: string;
  volume: number;
}

export const Mixer: React.FC = () => {
  const [channels, setChannels] = useState<ChannelData[]>([
    { id: 1, name: "Kick", color: "#ff4757", volume: 75 },
    { id: 2, name: "Snare", color: "#2ed573", volume: 80 },
    { id: 3, name: "Hi-Hat", color: "#3742fa", volume: 60 },
    { id: 4, name: "Bass", color: "#ffa502", volume: 85 },
  ]);

  const [mainVolume, setMainVolume] = useState(70);

  const handleChannelVolumeChange = (channelId: number, newVolume: number) => {
    setChannels((prevChannels) =>
      prevChannels.map((channel) =>
        channel.id === channelId ? { ...channel, volume: newVolume } : channel
      )
    );
  };

  const handleMainVolumeChange = (newVolume: number) => {
    setMainVolume(newVolume);
  };

  return (
    <div className="mixer">
      <div className="mixer-header">
        <h1>AT Mixer Companion</h1>
      </div>
      <div className="mixer-channels">
        {channels.map((channel) => (
          <Channel
            key={channel.id}
            name={channel.name}
            color={channel.color}
            volume={channel.volume}
            onVolumeChange={(volume) =>
              handleChannelVolumeChange(channel.id, volume)
            }
          />
        ))}
        <MainOutput
          volume={mainVolume}
          onVolumeChange={handleMainVolumeChange}
        />
      </div>
    </div>
  );
};
