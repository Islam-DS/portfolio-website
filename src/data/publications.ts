export interface Publication {
  title: string;
  authors: string;
  venue: string;
  year: string;
  abstract?: string;
  tags: string[];
  doi: string;
  link: string;
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
];
