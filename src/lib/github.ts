import { Project, fallbackProjects } from "@/data/projects";
import { projectOverrides } from "@/data/projectOverrides";

const GITHUB_USER = "Islam-DS";
const INCLUDE_TOPIC = "portfolio";
const FEATURE_TOPIC = "flagship";

interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  topics: string[];
  fork: boolean;
  archived: boolean;
  pushed_at: string;
}

function titleCase(name: string): string {
  return name
    .replace(/[-_]+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Pulls the live project list from GitHub. Any public, non-fork repo
 * tagged with the "portfolio" topic shows up automatically — no code
 * changes needed. Add the "flagship" topic to pick the featured one.
 * Curated extras (real result images, richer descriptions, demo links)
 * live in projectOverrides.ts, keyed by repo name, and layer on top.
 * A repo already listed in projectOverrides is always included even if
 * the "portfolio" tag is missing, so a curated project never silently
 * disappears — but the tag is still the recommended way to add new ones.
 */
export async function getGitHubProjects(): Promise<Project[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`,
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) throw new Error(`GitHub API responded ${res.status}`);

    const repos: GitHubRepo[] = await res.json();
    const included = repos.filter(
      (r) =>
        !r.fork &&
        !r.archived &&
        (r.topics?.includes(INCLUDE_TOPIC) || r.name in projectOverrides)
    );
    if (included.length === 0) throw new Error("No repos tagged 'portfolio'");

    const projects: Project[] = included.map((r) => {
      const override = projectOverrides[r.name] ?? {};
      return {
        id: r.name,
        title: override.title ?? titleCase(r.name),
        description:
          override.description ?? r.description ?? "No description provided yet.",
        tags: override.tags ?? r.topics.filter((t) => t !== INCLUDE_TOPIC && t !== FEATURE_TOPIC),
        github: r.html_url,
        demo: override.demo ?? r.homepage ?? undefined,
        stars: r.stargazers_count > 0 ? r.stargazers_count : undefined,
        language: override.language ?? r.language ?? "Code",
        featured: override.featured ?? r.topics.includes(FEATURE_TOPIC),
        image: override.image,
        imageAlt: override.imageAlt,
        codeDemo: override.codeDemo,
        pipeline: override.pipeline,
      };
    });

    if (!projects.some((p) => p.featured)) {
      const mostRecent = [...included].sort((a, b) => (a.pushed_at < b.pushed_at ? 1 : -1))[0];
      const match = projects.find((p) => p.id === mostRecent.name);
      if (match) match.featured = true;
    }

    return projects;
  } catch {
    return fallbackProjects;
  }
}
