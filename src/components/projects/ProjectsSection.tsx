import { Project } from "@/data/projects";
import { ProjectStage } from "./ProjectStage";
import { ProjectCard } from "./ProjectCard";

interface ProjectsSectionProps {
  projects: Project[];
}

/**
 * Picks between the pinned scroll-driven stage and a plain stacked card
 * list using CSS alone (motion-safe:lg: vs the inverse), not client-side
 * JS branching — both trees render identically on server and first
 * client paint, so there's no hydration mismatch or flash of the wrong
 * layout. `ProjectStage` additionally no-ops internally if it isn't the
 * active experience, so it costs nothing when hidden.
 */
export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <>
      <div className="hidden motion-safe:lg:block">
        <ProjectStage projects={projects} />
      </div>

      <div className="cinema-container-full mt-4 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:motion-safe:hidden">
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </>
  );
}
