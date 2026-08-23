export interface JourneyItem {
  icon: "flask" | "book" | "award" | "globe" | "heart" | "users" | "file";
  type: "Research" | "Work" | "Scholarship" | "Leadership";
  title: string;
  organization: string;
  period: string;
  location?: string;
  description: string[];
  tags: string[];
  link?: string;
  doi?: string;
}

export const journey: JourneyItem[] = [
  {
    icon: "book",
    type: "Work",
    title: "Head of English Department",
    organization: "Temirlan School",
    period: "2025 — Present",
    location: "Kazakhstan",
    description: [
      "Led curriculum design and faculty coordination for English programs",
      "Mentored students in academic communication and critical thinking",
      "Established quality standards for bilingual education delivery",
    ],
    tags: ["Leadership", "Education", "Management"],
  },
  {
    icon: "heart",
    type: "Leadership",
    title: "Advisor Panel Member",
    organization: "Laboratorians Red Crescent Alumni Association",
    period: "2025 — Present",
    location: "Dhaka, Bangladesh",
    description: [
      "Advising the alumni network of the Red Crescent Society on continuity and mentorship between graduating and incoming volunteers.",
    ],
    tags: ["Red Crescent", "Alumni Network", "Advisory"],
  },
  {
    icon: "flask",
    type: "Work",
    title: "Research Assistant",
    organization: "Artificial Intelligence & Robotics Laboratory",
    period: "2024 — Present",
    location: "Remote",
    description: [
      "Conducting research in oncology AI and multimodal medical data fusion",
      "Developing deep learning pipelines for clinical and biological datasets",
      "Contributing to reproducible research workflows and model evaluation",
    ],
    tags: ["Oncology AI", "Deep Learning", "Research"],
  },
  {
    icon: "globe",
    type: "Leadership",
    title: "Co-Founder",
    organization: "Initiator Academy, Dhaka",
    period: "2022 — Present",
    location: "Dhaka, Bangladesh",
    description: [
      "Built an educational initiative focused on STEM and leadership development",
      "Scaled programs reaching students across underserved communities",
      "Designed operational frameworks for sustainable nonprofit growth",
    ],
    tags: ["Entrepreneurship", "EdTech", "Community"],
  },
  {
    icon: "heart",
    type: "Leadership",
    title: "Group Leader",
    organization: "Red Crescent Society — Government Laboratory High School",
    period: "2020 — 2022",
    location: "Dhaka, Bangladesh",
    description: [
      "Organized humanitarian campaigns and community health initiatives",
      "Coordinated volunteer teams for disaster preparedness programs",
      "Represented youth leadership in national Red Crescent activities",
    ],
    tags: ["Volunteering", "Humanitarian", "Leadership"],
  },
  {
    icon: "users",
    type: "Leadership",
    title: "Senior Volunteer Manager",
    organization: "English Club of the Laboratory",
    period: "2019 — 2022",
    location: "Dhaka, Bangladesh",
    description: [
      "Managed volunteer operations and event programming for 100+ members",
      "Facilitated debate, public speaking, and academic English workshops",
      "Developed peer mentorship structures for sustained club engagement",
    ],
    tags: ["Volunteering", "English", "Management"],
  },
];
