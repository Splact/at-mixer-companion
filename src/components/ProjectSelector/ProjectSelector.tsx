import { useState, useEffect } from "react";
import { useAudiotool } from "../../contexts/AudiotoolContext";
import projectCoverPlaceholder from "../../assets/project-cover-placeholder.png";
import "./style.css";

interface Project {
  name: string;
  trackName: string;
  displayName: string;
  description: string;
  updateTime?: { toDate: () => Date };
  coverUrl?: string;
}

interface ProjectSelectorProps {
  onProjectSelect: (projectId: string, displayName: string) => void;
}

export function ProjectSelector({ onProjectSelect }: ProjectSelectorProps) {
  const { audiotool } = useAudiotool();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadProjects = async () => {
      if (!audiotool) {
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const projectsResponse =
          await audiotool.api.projectService.listProjects({});

        if (projectsResponse instanceof Error) {
          console.error("Failed to load projects:", projectsResponse.message);
          setError(`Failed to load projects: ${projectsResponse.message}`);
          return;
        }

        // Success case - projects is properly typed
        console.log(`Found ${projectsResponse.projects.length} projects`);
        setProjects(projectsResponse.projects);
      } catch (err) {
        console.error("Error loading projects:", err);
        setError("Failed to load projects. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, [audiotool]);

  const handleProjectClick = (projectId: string, displayName: string) => {
    onProjectSelect(projectId, displayName);
  };

  if (isLoading) {
    return (
      <div className="project-selector-container">
        <h1>Loading Projects...</h1>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="project-selector-container">
        <h1>Error Loading Projects</h1>
        <div className="error-message">{error}</div>
        <button
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="project-selector-container">
        <h1>No Projects Found</h1>
        <p>
          You don't have any projects yet. Please create a project on Audiotool
          first.
        </p>
        <a
          href="https://beta.audiotool.com"
          target="_blank"
          rel="noopener noreferrer"
          className="create-project-link"
        >
          Go to Audiotool
        </a>
      </div>
    );
  }

  return (
    <div className="project-selector-container">
      <h1>Select a Project</h1>
      <p>Choose a project to open in the mixer</p>

      <div className="projects-grid">
        {projects
          .sort(
            (a, b) =>
              (b.updateTime?.toDate().getTime() ?? 0) -
              (a.updateTime?.toDate().getTime() ?? 0)
          )
          .map((project) => (
            <div
              key={project.name}
              className="project-card"
              onClick={() =>
                handleProjectClick(project.name, project.displayName)
              }
            >
              <div className="project-cover">
                <img
                  src={project.coverUrl || projectCoverPlaceholder}
                  alt={`Cover for ${project.name}`}
                />
              </div>

              <div className="project-info">
                <h3 className="project-name">{project.displayName}</h3>
                {project.description && (
                  <p className="project-description">{project.description}</p>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
