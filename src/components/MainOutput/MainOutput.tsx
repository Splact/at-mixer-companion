import React, { useEffect, useState } from "react";
import { VolumeSlider } from "../VolumeSlider";
import { MuteButton } from "../MuteButton";
import "./style.css";
import { NexusEntity, SyncedDocument } from "audiotool-nexus/document";
import { normalizedToGain, gainToNormalized } from "../../utils/naturalGain";

interface MainOutputProps {
  nexusDocument: SyncedDocument;
  entity: NexusEntity<"mixerOut">;
}

export const MainOutput: React.FC<MainOutputProps> = ({
  nexusDocument,
  entity,
}) => {
  const [volume, setVolume] = useState(entity.fields.postGain.value);
  const [normalizedVolume, setNormalizedVolume] = useState(
    gainToNormalized(entity.fields.postGain.value)
  );
  // check if isMute field exists, default to false if not
  const [isMute, setIsMute] = useState(entity.fields.isMute?.value ?? false);

  useEffect(() => {
    const volumeSubscription = nexusDocument.events.onUpdate(
      entity.fields.postGain,
      (updatedVolume) => {
        setVolume(updatedVolume);
        // convert gain to normalized value for the slider
        setNormalizedVolume(gainToNormalized(updatedVolume));
      }
    );

    // only subscribe to mute updates if the field exists
    let muteSubscription: any = null;
    if (entity.fields.isMute) {
      muteSubscription = nexusDocument.events.onUpdate(
        entity.fields.isMute,
        (updatedMute) => {
          setIsMute(updatedMute);
        }
      );
    }

    return () => {
      volumeSubscription.terminate();
      if (muteSubscription) {
        muteSubscription.terminate();
      }
    };
  }, [entity]);

  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    const updatedNormalizedVolume = newValue as number;

    // convert normalized value to gain before setting on nexus
    const updatedGain = normalizedToGain(updatedNormalizedVolume);

    setNormalizedVolume(updatedNormalizedVolume);
    setVolume(updatedGain);

    nexusDocument.modify((t) => {
      t.update(entity.fields.postGain, updatedGain);
    });
  };

  const handleMuteToggle = () => {
    // only allow mute toggle if the field exists
    if (!entity.fields.isMute) {
      console.warn("Mute field not available on mixerOut entity");
      return;
    }

    const updatedMute = !isMute;
    setIsMute(updatedMute);

    nexusDocument.modify((t) => {
      t.update(entity.fields.isMute, updatedMute);
    });
  };

  return (
    <div className="main-output">
      <div className="main-output-label">MAIN OUT</div>
      <VolumeSlider
        volume={volume}
        normalizedVolume={normalizedVolume}
        onVolumeChange={handleVolumeChange}
        className="main-output-slider"
      />
      {entity.fields.isMute && (
        <div className="main-output-controls">
          <MuteButton
            isMute={isMute}
            onMuteToggle={handleMuteToggle}
            className="main-output-mute"
          />
        </div>
      )}
    </div>
  );
};
