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
  "retractionbench",
  "Med_AI-bias-audit",
  "pediatric-appendicitis-multimodal-ai",
  "OpenClock",
  "Deconvolution-review",
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
          index="02"
          label="Projects"
          title="Selected research projects"
          emphasis="projects"
          description="LLM evaluation, medical imaging, genomics, and spatial biology — each with its code on GitHub. Null and negative results are reported as they came out."
        />
      </div>

      <ProjectsSection projects={featured} />
    </SectionWrapper>
  );
}
