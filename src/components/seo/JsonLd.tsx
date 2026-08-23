import { siteConfig, focusAreas } from "@/data/site";

export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    jobTitle: "AI Researcher",
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
    sameAs: [siteConfig.github, siteConfig.linkedin, siteConfig.orcid],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
