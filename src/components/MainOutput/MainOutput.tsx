import React, { useEffect, useState } from "react";
import "./style.css";
import { NexusEntity, SyncedDocument } from "audiotool-nexus/document";

interface MainOutputProps {
  nexusDocument: SyncedDocument;
  entity: NexusEntity<"mixerOut">;
}

export const MainOutput: React.FC<MainOutputProps> = ({
  nexusDocument,
  entity,
}) => {
  const [volume, setVolume] = useState(entity.fields.postGain.value);

  useEffect(() => {
    const volumeSubscription = nexusDocument.events.onUpdate(
      entity.fields.postGain,
      (updatedVolume) => {
        setVolume(updatedVolume);
      }
    );

    return () => {
      volumeSubscription.terminate();
    };
  }, [entity]);

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // TODO: implement
  };

  return (
    <div className="main-output">
      <div className="main-output-label">MAIN OUT</div>
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
