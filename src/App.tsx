import React, { useState, useEffect } from "react";
import { createAudiotoolClient } from "audiotool-nexus";
import { Mixer } from "./components/Mixer";
import { PATForm } from "./components/PATForm";
import { LoadingScreen } from "./components/LoadingScreen";
import { AppHeader } from "./components/AppHeader";
import "./App.css";

function App() {
  const [isPATSet, setIsPATSet] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [audiotool, setAudiotool] = useState<any>(null);

  useEffect(() => {
    const initializeClient = async () => {
      try {
        const client = await createAudiotoolClient();
        setAudiotool(client);

        // check if client already has a PAT
        if (client.hasPAT()) {
          setIsPATSet(true);
        }
      } catch (err) {
        console.error("Error creating Audiotool client:", err);
        setError(
          "Failed to create Audiotool client. Please refresh the page and try again."
        );
      }
    };

    initializeClient();
  }, []);

  const handlePATSubmit = async (pat: string) => {
    if (!audiotool) {
      setError("Audiotool client not initialized. Please refresh the page.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      audiotool.setPAT(pat);
      setIsPATSet(true);
    } catch (err) {
      setError("Failed to set PAT. Please check your token and try again.");
      console.error("Error setting PAT:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPAT = () => {
    if (audiotool) {
      audiotool.setPAT(""); // clear the PAT
    }
    setIsPATSet(false);
    setError("");
  };

  // show loading state while initializing client
  if (!audiotool) {
    return <LoadingScreen error={error} />;
  }

  if (!isPATSet) {
    return (
      <PATForm onSubmit={handlePATSubmit} isLoading={isLoading} error={error} />
    );
  }

  return (
    <div className="App">
      <AppHeader onResetPAT={handleResetPAT} />
      <Mixer />
    </div>
  );
}

export default App;
