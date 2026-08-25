import { getGitHubProjects } from "@/lib/github";
import { SectionWrapper } from "@/components/effects/SectionWrapper";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeaturedProject } from "@/components/projects/FeaturedProject";
import { ProjectCard } from "@/components/projects/ProjectCard";

export async function Projects() {
  const projects = await getGitHubProjects();
  const flagship = projects.find((p) => p.featured) ?? projects[0];
  const secondary = projects.filter((p) => p.id !== flagship.id);

  return (
    <SectionWrapper id="projects" className="bg-cinema-surface/80">
      <div className="cinema-container">
        <SectionHeading
          index="04"
          label="Projects"
          title="Research engineered for impact"
          description="Open-source systems spanning oncology AI, federated learning, and computational biology. Pulled live from GitHub."
        />

        <FeaturedProject project={flagship} />

        {secondary.length > 0 && (
          <div className="mt-24">
            <p className="section-label mb-8">More Research</p>
            <div className="grid gap-8 md:grid-cols-2">
              {secondary.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
