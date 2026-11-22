import { siteConfig, focusAreas } from "@/data/site";

export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    jobTitle: "BSc Data Science Student and Medical AI Researcher",
    description: siteConfig.description,
    url: siteConfig.url,
    email: siteConfig.email,
    knowsAbout: focusAreas,
    alumniOf: [
      {
        "@type": "CollegeOrUniversity",
        name: "Al-Farabi Kazakh National University",
      },
      {
        "@type": "EducationalOrganization",
        name: "Government Laboratory High School",
      },
    ],
    sameAs: [siteConfig.scholar, siteConfig.orcid, siteConfig.github, siteConfig.linkedin],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
