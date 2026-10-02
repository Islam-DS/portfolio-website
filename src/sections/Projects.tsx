import { getGitHubProjects } from "@/lib/github";
import { SectionWrapper } from "@/components/effects/SectionWrapper";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectsSection } from "@/components/projects/ProjectsSection";

/**
 * A deliberately curated subset, not "every repo with the portfolio topic" —
 * the strongest, most visually substantiated work rather than an exhaustive
 * list. Order is editorial (lead with the most rigorous/published piece),
 * not alphabetical or fetch order. Every entry here has a real result image.
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
    <SectionWrapper id="projects" className="overflow-visible">
      <div className="cinema-container-full">
        <SectionHeading
          index="03"
          label="Projects"
          title="Research engineered for impact"
          description="A curated selection of research spanning oncology AI, federated learning, and computational biology — synced live from GitHub."
        />
      </div>

      <ProjectsSection projects={featured} />
    </SectionWrapper>
  );
}
