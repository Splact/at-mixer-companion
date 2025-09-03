import React, { useState, useEffect } from "react";
import { useAudiotool } from "../../contexts/AudiotoolContext";
import "./style.css";

interface User {
  name: string;
  displayName: string | undefined;
  avatarUrl: string | undefined;
}

interface AppHeaderProps {
  onResetPAT: () => void;
  onProjectSelect: () => void;
}

export function AppHeader({ onResetPAT, onProjectSelect }: AppHeaderProps) {
  const { audiotool } = useAudiotool();
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!audiotool) {
        return;
      }

      setIsLoadingUser(true);

      try {
        const userResponse = await audiotool.api.userService.getUser({});

        if (userResponse instanceof Error) {
          console.error("Failed to load user:", userResponse.message);
          return;
        }

        if (userResponse.user === undefined) {
          console.error("Failed to load user.");
          return;
        }

        // map the response to our User interface
        const userData: User = {
          name: userResponse.user.name,
          displayName: userResponse.user.displayName,
          avatarUrl: userResponse.user.avatarUrl,
        };

        setUser(userData);
      } catch (err) {
        console.error("Error loading user:", err);
      } finally {
        setIsLoadingUser(false);
      }
    };

    loadUser();
  }, [audiotool]);

  return (
    <div className="header">
      <div className="header-left">
        <h1>AT Mixer</h1>
        {!isLoadingUser && user && (
          <div className="user-info">
            {user.avatarUrl && (
              <img
                src={user.avatarUrl}
                alt={`${user.name}'s profile`}
                className="user-avatar"
              />
            )}
            <span className="user-name">{user.displayName}</span>
          </div>
        )}
      </div>

      <div className="header-buttons">
        <button onClick={onProjectSelect} className="project-select-button">
          Change Project
        </button>
        <button onClick={onResetPAT} className="reset-button">
          Change PAT
        </button>
      </div>
    </div>
  );
}
