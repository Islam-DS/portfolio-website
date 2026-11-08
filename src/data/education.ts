export interface EducationItem {
  institution: string;
  degree: string;
  period: string;
  location: string;
  highlights: string[];
  badge?: string;
  image?: string;
}

export const education: EducationItem[] = [
  {
    institution: "Al-Farabi Kazakh National University",
    degree: "BSc in Data Science",
    period: "2023 — Present",
    location: "Almaty, Kazakhstan",
    highlights: [
      "GPA 3.82 / 4.00 — Red Diploma candidate",
      "Kazakhstan Government Scholarship, fully funded",
      "180 / 240 ECTS · expected graduation 30 June 2027",
    ],
    badge: "International Scholar",
    image: "/images/enhanced_university_images.gif",
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
    image: "/images/enhanced_school_images.gif",
  },
];

/** Courses completed, as listed in the CV. */
export const coursework = [
  "Machine Learning",
  "Deep Learning",
  "Natural Language Processing",
  "Data Mining",
  "Feature Engineering",
  "Classification & Clustering",
  "Probability & Statistics",
  "Applied Statistics",
  "Artificial Intelligence",
  "Data Engineering",
  "Data Structures & Algorithms",
  "Discrete Mathematics",
  "Database Theory",
  "Python",
  "R",
];

/** Honours, transcribed from the CV's "International achievements". */
export const honours = [
  {
    title: "Kazakhstan Government Scholarship",
    period: "Sep 2023 — Present",
    detail: "Fully funded scholarship for the BSc in Data Science at Al-Farabi Kazakh National University.",
  },
  {
    title: "ICCR Scholarship — Government of India",
    period: "Awarded 2023",
    detail: "Fully funded; declined in favour of the Kazakhstan Government Scholarship.",
  },
  {
    title: "Mediterranean Machine Learning Summer School",
    period: "8 — 12 Sep 2025",
    detail: "Selected to attend, University of Split, Croatia.",
  },
];
