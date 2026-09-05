import { getGitHubProjects } from "@/lib/github";
import { SectionWrapper } from "@/components/effects/SectionWrapper";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeaturedProject } from "@/components/projects/FeaturedProject";
import { ProjectTile } from "@/components/projects/ProjectTile";

// Editorial rhythm across a 6-column grid: two wide tiles, then a row of three
// narrower ones, then two wide again. Avoids the flat uniform grid while still
// filling every row. Extra projects simply flow on in the same cadence.
const SPAN_PATTERN = ["md:col-span-3", "md:col-span-3", "md:col-span-2", "md:col-span-2", "md:col-span-2"];

export async function Projects() {
  const projects = await getGitHubProjects();
  const flagship = projects.find((p) => p.featured) ?? projects[0];
  const secondary = projects.filter((p) => p.id !== flagship.id);

  return (
    <SectionWrapper id="projects">
      <div className="cinema-container-full">
        <SectionHeading
          index="03"
          label="Projects"
          title="Research engineered for impact"
          description="Open-source systems spanning oncology AI, federated learning, and computational biology. Pulled live from GitHub."
        />

        <FeaturedProject project={flagship} />

        {secondary.length > 0 && (
          <div className="mt-24">
            <p className="section-label mb-8">More Research</p>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-6">
              {secondary.map((project, i) => (
                <div
                  key={project.id}
                  className={SPAN_PATTERN[i % SPAN_PATTERN.length]}
                >
                  <ProjectTile project={project} index={i} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
