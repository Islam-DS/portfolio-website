export interface EducationItem {
  institution: string;
  degree: string;
  period: string;
  location: string;
  highlights: string[];
  badge?: string;
}

export const education: EducationItem[] = [
  {
    institution: "Al-Farabi Kazakh National University",
    degree: "BSc in Data Science",
    period: "2022 — Present",
    location: "Almaty, Kazakhstan",
    highlights: [
      "International Government Scholar",
      "Advanced coursework in ML, statistics, and data engineering",
      "Research focus on medical AI and federated systems",
    ],
    badge: "International Scholar",
  },
  {
    institution: "Government Laboratory High School",
    degree: "Secondary Education",
    period: "Completed",
    location: "Dhaka, Bangladesh",
    highlights: [
      "Science-focused curriculum with research orientation",
      "Leadership in Red Crescent Society and English Club",
      "Foundation for computational and analytical thinking",
    ],
  },
];
