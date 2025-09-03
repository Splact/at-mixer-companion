import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { type AudiotoolClient, createAudiotoolClient } from "audiotool-nexus";

interface AudiotoolContextType {
  audiotool: AudiotoolClient | null;
  isLoading: boolean;
  error: string | null;
  isPATSet: boolean;
  setPAT: (pat: string) => Promise<void>;
  clearPAT: () => void;
}

const AudiotoolContext = createContext<AudiotoolContextType | undefined>(
  undefined
);

interface AudiotoolProviderProps {
  children: ReactNode;
}

export function AudiotoolProvider({ children }: AudiotoolProviderProps) {
  const [audiotool, setAudiotool] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPATSet, setIsPATSet] = useState<boolean>(false);

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
      } finally {
        setIsLoading(false);
      }
    };

    initializeClient();
  }, []);

  const setPAT = async (pat: string) => {
    if (!audiotool) {
      throw new Error("Audiotool client not initialized");
    }

    audiotool.setPAT(pat);
    setIsPATSet(true);
  };

  const clearPAT = () => {
    if (audiotool) {
      audiotool.setPAT(""); // clear the PAT
    }
    setIsPATSet(false);
    setError(null);
  };

  const value: AudiotoolContextType = {
    audiotool,
    isLoading,
    error,
    isPATSet,
    setPAT,
    clearPAT,
  };

  return (
    <AudiotoolContext.Provider value={value}>
      {children}
    </AudiotoolContext.Provider>
  );
}

export function useAudiotool() {
  const context = useContext(AudiotoolContext);
  if (context === undefined) {
    throw new Error("useAudiotool must be used within an AudiotoolProvider");
  }
  return context;
}
