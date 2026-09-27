export interface Publication {
  title: string;
  authors: string;
  venue: string;
  year: string;
  abstract?: string;
  tags: string[];
  doi: string;
  link: string;
  /** Defaults to "Conference Paper" for existing entries if omitted. */
  type?: "Conference Paper" | "Preprint" | "Journal Article";
}

export const publications: Publication[] = [
  {
    title:
      "Conflict-Aware Adaptive Regularization for Federated Learning Under Data Heterogeneity: A Multi-Dataset Medical Study",
    authors: "Md. Mahbubul Islam, Nadezhda Kunicina",
    venue:
      "13th IEEE Workshop on Advances in Information, Electronic and Electrical Engineering (AIEEE'2026) · Riga, Latvia",
    year: "2026",
    tags: ["Federated Learning", "Medical AI", "Data Heterogeneity"],
    doi: "10.1109/AIEEE71113.2026.11576917",
    link: "https://doi.org/10.1109/AIEEE71113.2026.11576917",
  },
  {
    title:
      "Recent Advancements in Electronic Nose Systems and AI-Driven Diagnostics for Cancer Volatilomics: Current Status and Clinical Challenges",
    authors: "Md. Mahbubul Islam, Ainur Yerkos, Zholdas Buribayev",
    venue: "Preprints.org (MDPI)",
    year: "2026",
    abstract:
      "A review of Electronic Nose (E-nose) sensor technologies for non-invasive cancer detection via volatile organic compounds — covering sensor types (metal oxide semiconductor, conducting polymer, quartz crystal microbalance, surface acoustic wave, colorimetric, electrochemical), the biological basis of VOC production, and how machine learning and deep learning are used for preprocessing, feature extraction, and classification, with case studies in lung, breast, and kidney cancer.",
    tags: ["Cancer Diagnostics", "Electronic Nose", "Review"],
    doi: "10.20944/preprints202609.1158.v1",
    link: "https://doi.org/10.20944/preprints202609.1158.v1",
    type: "Preprint",
  },
];
