import React, { useEffect, useState } from "react";
import "./style.css";
import { NexusEntity, SyncedDocument } from "audiotool-nexus/document";
import { MIXER_COLOR_SETS } from "../../mixer-colors";

interface ChannelProps {
  nexusDocument: SyncedDocument;
  entity: NexusEntity<"mixerChannel">;
}

export const Channel: React.FC<ChannelProps> = ({ nexusDocument, entity }) => {
  const [name, setName] = useState(
    entity.fields.displayParameters.fields.name.value
  );
  const [colorIndex, setColorIndex] = useState(
    entity.fields.displayParameters.fields.colorIndex.value
  );
  const [volume, setVolume] = useState(
    entity.fields.faderParameters.fields.postGain.value
  );
  const colorSet = MIXER_COLOR_SETS[colorIndex] ?? MIXER_COLOR_SETS[0];

  useEffect(() => {
    const nameSubscription = nexusDocument.events.onUpdate(
      entity.fields.displayParameters.fields.name,
      (updatedName) => {
        setName(updatedName);
      }
    );
    const colorIndexSubscription = nexusDocument.events.onUpdate(
      entity.fields.displayParameters.fields.colorIndex,
      (updatedColorIndex) => {
        setColorIndex(updatedColorIndex);
      }
    );
    const volumeSubscription = nexusDocument.events.onUpdate(
      entity.fields.faderParameters.fields.postGain,
      (updatedVolume) => {
        setVolume(updatedVolume);
      }
    );

    return () => {
      nameSubscription.terminate();
      colorIndexSubscription.terminate();
      volumeSubscription.terminate();
    };
  }, [entity]);

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // TODO: implement
  };

  return (
    <div className="channel">
      <div className="channel-name">{name}</div>
      <div
        className="channel-color"
        style={{ backgroundColor: colorSet.background }}
      ></div>
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
