import React, { useState } from "react";
import { AudiotoolProvider, useAudiotool } from "./contexts/AudiotoolContext";
import { Mixer } from "./components/Mixer";
import { PATForm } from "./components/PATForm";
import { ProjectSelector } from "./components/ProjectSelector";
import { LoadingScreen } from "./components/LoadingScreen";
import { AppHeader } from "./components/AppHeader";
import "./App.css";

function AppContent() {
  const { audiotool, isLoading, error, isPATSet, setPAT, clearPAT } =
    useAudiotool();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [selectedProjectDisplayName, setSelectedProjectDisplayName] = useState<
    string | null
  >(null);
  const [isSettingPAT, setIsSettingPAT] = useState<boolean>(false);
  const [patError, setPatError] = useState<string>("");

  const handlePATSubmit = async (pat: string) => {
    if (!audiotool) {
      setPatError("Audiotool client not initialized. Please refresh the page.");
      return;
    }

    setIsSettingPAT(true);
    setPatError("");

    try {
      await setPAT(pat);
    } catch (err) {
      setPatError("Failed to set PAT. Please check your token and try again.");
      console.error("Error setting PAT:", err);
    } finally {
      setIsSettingPAT(false);
    }
  };

  const handleProjectSelect = (projectId: string, displayName: string) => {
    setSelectedProjectId(projectId);
    setSelectedProjectDisplayName(displayName);
  };

  const handleResetPAT = () => {
    clearPAT();
    setSelectedProjectId(null);
    setSelectedProjectDisplayName(null);
  };

  // show loading state while initializing client
  if (isLoading) {
    return <LoadingScreen error={error || ""} />;
  }

  if (!isPATSet) {
    return (
      <PATForm
        onSubmit={handlePATSubmit}
        isLoading={isSettingPAT}
        error={patError}
      />
    );
  }

  return (
    <div className="App">
      <AppHeader
        onResetPAT={handleResetPAT}
        onProjectSelect={() => {
          // HACK: refresh the page because we cannot dismiss current document sync
          window.location.reload();
        }}
      />

      {!selectedProjectId ? (
        <ProjectSelector onProjectSelect={handleProjectSelect} />
      ) : (
        <Mixer
          projectId={selectedProjectId}
          projectDisplayName={selectedProjectDisplayName}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AudiotoolProvider>
      <AppContent />
    </AudiotoolProvider>
  );
}

export default App;
