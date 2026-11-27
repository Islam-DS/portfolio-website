/** Work experience, transcribed from the CV. Order follows the CV. */
export interface WorkItem {
  title: string;
  organization: string;
  period: string;
  location?: string;
  department?: string;
  summary: string;
  /** Phrases bolded in the CV — each must appear verbatim in `summary`. */
  emphasis: string[];
  /** Headline figure, taken from the CV text. */
  stat: { value: number; suffix?: string; label: string };
  /** Short points condensed from `summary` — no facts beyond the CV. */
  points: string[];
  /** Photos from the role (full size; a `-thumb` copy sits next to each). */
  photos?: WorkPhoto[];
  /** Short silent montage from the role. */
  video?: { src: string; poster: string; caption: string; landscape?: boolean };
}

export interface WorkPhoto {
  src: string;
  alt: string;
  caption: string;
}

export const work: WorkItem[] = [
  {
    title: "University Research Assistant",
    organization: "Laboratory of Artificial Intelligence & Robotics · Farabi University",
    period: "1 Mar 2024 — Present",
    department: "Artificial Intelligence & Big Data",
    summary:
      "Research Assistant with 2.5+ years of experience in bioinformatics, cancer research, biomedical AI, and data science, working 30 hours per week. Experienced in analyzing molecular, clinical, and medical imaging data using statistical modelling and machine learning with R and Python. Contribute to interdisciplinary research, reproducible computational workflows, and the training of new laboratory members by providing guidance on fundamental concepts, research tasks, projects, and computational methods.",
    emphasis: [
      "2.5+ years of experience",
      "working 30 hours per week",
      "molecular, clinical, and medical imaging data",
      "training of new laboratory members",
    ],
    stat: { value: 30, suffix: " hrs", label: "of research every week" },
    points: [
      "2.5+ years in bioinformatics, cancer research, biomedical AI and data science",
      "Molecular, clinical and medical imaging data — statistical modelling and ML in R and Python",
      "Reproducible computational workflows for interdisciplinary research",
      "Trains new laboratory members on concepts, research tasks, projects and methods",
    ],
  },
  {
    title: "English Teacher",
    organization: "Temirlan School",
    period: "2 Sep 2025 — Present",
    location: "Kazakhstan",
    summary: "Teaching English to 35+ students currently.",
    emphasis: ["35+ students"],
    stat: { value: 35, suffix: "+", label: "students taught English" },
    points: ["Teaching English to 35+ students at Temirlan School"],
    video: {
      src: "/videos/temirlan-teaching.mp4",
      poster: "/videos/temirlan-teaching-poster.jpg",
      caption: "Preparing lessons and teaching English at Temirlan School",
    },
  },
  {
    title: "Co-Founder & Teacher",
    organization: "Initiator Academy",
    period: "8 Jan 2021 — Present",
    location: "Dhaka, Bangladesh",
    summary:
      "Co-founded a private school in my locality to provide free, quality education to underprivileged students and create employment opportunities for capable but financially constrained peers. Served as Academic Section Manager and Financial Head, supporting academic and strategic development while teaching English, ICT, Science, and Mathematics. Worked ~6 hours/day before moving to Kazakhstan and now contribute ~2 hours/week online (Sundays). Taught, mentored, and supported 213 students from Grade 8 through university level and helped create employment opportunities for 5 teachers. Maintained an inclusive environment where all students received equal treatment regardless of financial background.",
    emphasis: [
      "Co-founded a private school",
      "provide free, quality education to underprivileged students",
      "Academic Section Manager and Financial Head",
      "teaching English, ICT, Science, and Mathematics",
      "213 students",
      "employment opportunities for 5 teachers",
    ],
    stat: { value: 213, label: "students taught & mentored" },
    points: [
      "Co-founded a private school giving free, quality education to underprivileged students",
      "Academic Section Manager and Financial Head",
      "Taught English, ICT, Science and Mathematics — Grade 8 to university level",
      "Created employment opportunities for 5 teachers",
      "Still teaching online from Kazakhstan, ~2 hours every Sunday",
    ],
    video: {
      src: "/videos/initiator-academy.mp4",
      poster: "/videos/initiator-academy-poster.jpg",
      caption: "Classes and student groups at Initiator Academy (students' faces blurred)",
      landscape: true,
    },
    photos: [
      {
        src: "/images/experience/initiator-teaching.jpg",
        alt: "Teaching at the whiteboard while students follow from their desks at Initiator Academy",
        caption: "Teaching a class at Initiator Academy",
      },
      {
        src: "/images/experience/initiator-students.jpg",
        alt: "Selfie with a group of Initiator Academy students in the classroom, their faces blurred for privacy",
        caption: "With students after class",
      },
      {
        src: "/images/experience/initiator-team.jpg",
        alt: "Group photo with a few Initiator Academy students, their faces blurred for privacy",
        caption: "With one of my student groups",
      },
    ],
  },
];
