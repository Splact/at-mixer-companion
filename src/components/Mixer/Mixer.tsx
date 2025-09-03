import React, { useState, useEffect, useRef } from "react";
import { useAudiotool } from "../../contexts/AudiotoolContext";
import { Channel } from "../Channel";
import { MainOutput } from "../MainOutput";
import "./style.css";
import { NexusEntity, SyncedDocument } from "audiotool-nexus/document";

interface MixerProps {
  projectId: string;
}

export const Mixer: React.FC<MixerProps> = ({ projectId }) => {
  const { audiotool } = useAudiotool();
  const [mixerChannels, setMixerChannels] = useState<
    NexusEntity<"mixerChannel">[]
  >([]);
  const [mixerOut, setMixerOut] = useState<NexusEntity<"mixerOut">>();
  const [nexusDocument, setNexusDocument] = useState<SyncedDocument>();
  const [isLoading, setIsLoading] = useState(true);
  const isNexusDocumentSetup = useRef<boolean>(false);

  useEffect(() => {
    const setupNexusDocument = async () => {
      if (!audiotool || !projectId || isNexusDocumentSetup.current) {
        return;
      }

      console.log("Setting up Nexus document...");

      try {
        setIsLoading(true);
        isNexusDocumentSetup.current = true;

        // create the synced document
        const nexusDocument = await audiotool.createSyncedDocument({
          mode: "online",
          project: projectId,
        });

        // add listener for mixerChannel creation
        nexusDocument.events.onCreate("mixerChannel", (mixerChannel) => {
          console.log("mixerChannel created:", mixerChannel.id);
          setMixerChannels((prevChannels) => {
            // check if channel already exists
            if (prevChannels.find((ch) => ch.id === mixerChannel.id)) {
              return prevChannels;
            }

            return [...prevChannels, mixerChannel];
          });

          nexusDocument.events.onRemove(mixerChannel, () => {
            console.log("mixerChannel removed:", mixerChannel.id);

            setMixerChannels((prevChannels) =>
              prevChannels.filter((ch) => ch.id !== mixerChannel.id)
            );
          });
        });

        nexusDocument.events.onCreate("mixerOut", (mixerOut) => {
          console.log("mixerOut created:", mixerOut.id);

          setMixerOut(mixerOut);

          nexusDocument.events.onRemove(mixerOut, () => {
            console.log("mixerOut removed:", mixerOut.id);

            setMixerOut(undefined);
          });
        });

        console.log("Starting Nexus document sync...");

        // start the synced document
        await nexusDocument.start();

        console.log("Nexus document sync started.");

        setNexusDocument(nexusDocument);
      } catch (error) {
        console.error("Error setting up nexus document:", error);
      } finally {
        setIsLoading(false);
      }
    };

    setupNexusDocument();
  }, []);

  if (isLoading) {
    return (
      <div className="mixer">
        <div className="mixer-header">
          <h1>AT Mixer Companion</h1>
          <div className="project-info">
            <span className="project-label">Project:</span>
            <span className="project-id">{projectId}</span>
          </div>
        </div>
        <div className="loading-message">Setting up mixer...</div>
      </div>
    );
  }

  return (
    <div className="mixer">
      <div className="mixer-header">
        <h1>AT Mixer Companion</h1>
        <div className="project-info">
          <span className="project-label">Project:</span>
          <span className="project-id">{projectId}</span>
        </div>
      </div>

      {nexusDocument && (
        <div className="mixer-channels">
          {mixerChannels.map((channel) => (
            <Channel
              key={channel.id}
              nexusDocument={nexusDocument}
              entity={channel}
            />
          ))}

          {mixerOut && (
            <MainOutput nexusDocument={nexusDocument} entity={mixerOut} />
          )}
        </div>
      )}
    </div>
  );
};
