import { getGitHubProjects } from "@/lib/github";
import { SectionWrapper } from "@/components/effects/SectionWrapper";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectTile } from "@/components/projects/ProjectTile";
import { ProjectStack } from "@/components/projects/ProjectStack";

/**
 * A deliberately curated subset, not "every repo with the portfolio topic" —
 * the strongest, most visually substantiated work rather than an exhaustive
 * list. Order is editorial (lead with the most rigorous/published piece),
 * not alphabetical or fetch order. Every entry here has a real result image,
 * so the grid reads as uniform tiles rather than a mix of photos and
 * icon-only placeholders.
 */
const FEATURED_IDS = [
  "Med_AI-bias-audit",
  "pediatric-appendicitis-multimodal-ai",
  "OpenClock",
  "nematic-orientation-histopathology",
  "topognn-tnbc-recurrence",
  "brca-singlecell-pam50",
];

export async function Projects() {
  const projects = await getGitHubProjects();
  const byId = new Map(projects.map((p) => [p.id, p]));
  const featured = FEATURED_IDS.map((id) => byId.get(id)).filter((p) => p != null);

  return (
    <SectionWrapper id="projects">
      <div className="cinema-container-full">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-12">
          <SectionHeading
            index="03"
            label="Projects"
            title="Research engineered for impact"
            description="A curated selection of research spanning oncology AI, federated learning, and computational biology — synced live from GitHub."
          />
          <ProjectStack projects={featured} />
        </div>

        <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project, i) => (
            <ProjectTile key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
