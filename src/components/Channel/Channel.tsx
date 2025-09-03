import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { VolumeSlider } from "../VolumeSlider";
import { MuteButton } from "../MuteButton";
import "./style.css";
import { NexusEntity, SyncedDocument } from "audiotool-nexus/document";
import { getSchemaLocationDetails } from "audiotool-nexus";
import { MIXER_COLOR_SETS } from "../../mixer-colors";
import { normalizedToGain, gainToNormalized } from "../../utils/naturalGain";

interface ChannelProps {
  nexusDocument: SyncedDocument;
  entity: NexusEntity<"mixerChannel">;
  index: number;
}

export const Channel: React.FC<ChannelProps> = ({
  nexusDocument,
  entity,
  index,
}) => {
  const [name, setName] = useState(
    entity.fields.displayParameters.fields.name.value
  );
  const [colorIndex, setColorIndex] = useState(
    entity.fields.displayParameters.fields.colorIndex.value
  );
  const [volume, setVolume] = useState(
    entity.fields.faderParameters.fields.postGain.value
  );
  const [normalizedVolume, setNormalizedVolume] = useState(
    gainToNormalized(entity.fields.faderParameters.fields.postGain.value)
  );
  const [isMute, setIsMute] = useState(
    entity.fields.faderParameters.fields.isMute.value
  );
  const [isSolo, setIsSolo] = useState(
    entity.fields.faderParameters.fields.isSolo.value
  );
  const colorSet = MIXER_COLOR_SETS[colorIndex] ?? MIXER_COLOR_SETS[0];

  useEffect(() => {
    // get the valid range for the volume slider from the schema
    const getSliderRange = () => {
      try {
        const details = getSchemaLocationDetails(
          entity.fields.faderParameters.fields.postGain.location
        );

        if (
          details.type === "primitive" &&
          details.primitive.type === "number"
        ) {
          const range = details.primitive.range;
          if (range) {
            // we'll keep the range info for reference but use normalized values (0-1) for the slider
            console.log("Original gain range:", range);
          }
        }
      } catch (error) {
        // fallback to default range if schema lookup fails
        console.warn(
          "Failed to get slider range from schema, using defaults:",
          error
        );
      }
    };

    getSliderRange();

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
        // convert gain to normalized value for the slider
        setNormalizedVolume(gainToNormalized(updatedVolume));
      }
    );
    const muteSubscription = nexusDocument.events.onUpdate(
      entity.fields.faderParameters.fields.isMute,
      (updatedMute) => {
        setIsMute(updatedMute);
      }
    );
    const soloSubscription = nexusDocument.events.onUpdate(
      entity.fields.faderParameters.fields.isSolo,
      (updatedSolo) => {
        setIsSolo(updatedSolo);
      }
    );

    return () => {
      nameSubscription.terminate();
      colorIndexSubscription.terminate();
      volumeSubscription.terminate();
      muteSubscription.terminate();
      soloSubscription.terminate();
    };
  }, [entity]);

  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    const updatedNormalizedVolume = newValue as number;

    // convert normalized value to gain before setting on nexus
    const updatedGain = normalizedToGain(updatedNormalizedVolume);

    setNormalizedVolume(updatedNormalizedVolume);
    setVolume(updatedGain);

    nexusDocument.modify((t) => {
      t.update(entity.fields.faderParameters.fields.postGain, updatedGain);
    });
  };

  const handleMuteToggle = () => {
    const updatedMute = !isMute;
    setIsMute(updatedMute);

    nexusDocument.modify((t) => {
      t.update(entity.fields.faderParameters.fields.isMute, updatedMute);
    });
  };

  const handleSoloToggle = () => {
    const updatedSolo = !isSolo;
    setIsSolo(updatedSolo);

    nexusDocument.modify((t) => {
      t.update(entity.fields.faderParameters.fields.isSolo, updatedSolo);
    });
  };

  return (
    <div className="channel">
      <div className="channel-index">{index + 1}</div>
      <div className="channel-name">{name || "Channel"}</div>
      <div
        className="channel-color"
        style={{ backgroundColor: colorSet.background }}
      ></div>
      <VolumeSlider
        volume={volume}
        normalizedVolume={normalizedVolume}
        onVolumeChange={handleVolumeChange}
        className="channel-slider"
      />
      <div className="channel-controls">
        <MuteButton
          isMute={isMute}
          onMuteToggle={handleMuteToggle}
          className="channel-mute"
        />
        <Button
          onClick={handleSoloToggle}
          className={`control-button solo-button ${isSolo ? "active" : ""}`}
          size="small"
          variant="outlined"
        >
          S
        </Button>
      </div>
    </div>
  );
};
