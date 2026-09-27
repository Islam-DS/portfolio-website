export interface ProjectPipelineStep {
  icon: "scan" | "users" | "scale" | "eye";
  label: string;
  detail: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  github: string;
  demo?: string;
  stars?: number;
  language: string;
  featured?: boolean;
  image?: string;
  imageAlt?: string;
  codeDemo?: { command: string; output: string };
  /** Optional methodology diagram for the flagship card — a few real
   * pipeline stages pulled from the project's own description, not
   * fabricated. Only set where a project actually has a clear process
   * worth diagramming. */
  pipeline?: ProjectPipelineStep[];
}

/**
 * Used only if the live GitHub fetch fails (network issue, rate limit).
 * The real, current list is fetched from GitHub at request time — see
 * src/lib/github.ts. This is a frozen snapshot so the section never
 * renders empty.
 */
export const fallbackProjects: Project[] = [
  {
    id: "pediatric-appendicitis-multimodal-ai",
    title: "Pediatric Appendicitis Multimodal AI",
    description:
      "Leakage-aware multimodal machine learning framework integrating clinical assessment, laboratory biomarkers, and ultrasound imaging for pediatric appendicitis diagnosis. The multimodal fusion model reached AUC 0.896, outperforming clinical-only (0.849) and image-only (0.756) baselines, with patient-level leakage prevention, calibration analysis, and decision curve analysis. Co-authored with Ainur Yerkos and Zhandos Buribayev.",
    tags: ["Multimodal AI", "Medical AI", "Clinical ML"],
    github: "https://github.com/Islam-DS/pediatric-appendicitis-multimodal-ai",
    language: "Jupyter Notebook",
    featured: true,
    image: "/images/projects/pediatric-appendicitis-roc.png",
    imageAlt: "ROC and precision-recall curves comparing clinical, image-only, and multimodal models for pediatric appendicitis diagnosis",
  },
  {
    id: "brca-singlecell-pam50",
    title: "Single-Cell Breast Cancer PAM50 Subtype Classifier",
    description:
      "Predicts clinically important breast cancer molecular subtypes (Luminal A/B, HER2-enriched, Basal-like) from single-cell gene expression using a public epithelial cell atlas and an interpretable multiclass logistic regression model.",
    tags: ["Oncology AI", "Single-Cell", "Interpretable ML"],
    github: "https://github.com/Islam-DS/brca-singlecell-pam50",
    language: "Jupyter Notebook",
    stars: 1,
    image: "/images/projects/brca-pam50-umap.png",
    imageAlt: "UMAP projection of single-cell breast cancer data colored by predicted PAM50 molecular subtype",
  },
  {
    id: "EduMind-Sentinel",
    title: "EduMind Sentinel",
    description:
      "AI-powered student wellness platform that identifies emotional wellness risk patterns from behavioral, academic, and lifestyle indicators, with an explainable AI dashboard and crisis-support resources. Deployed as a live application.",
    tags: ["Explainable AI", "Wellness Tech", "Streamlit"],
    github: "https://github.com/Islam-DS/EduMind-Sentinel",
    demo: "https://edumind-sentinel-gvozxzoxwwxiujuyzrl3wk.streamlit.app/",
    language: "Python",
    image: "/images/projects/edumind-sentinel-homepage.png",
    imageAlt: "Homepage screenshot of the deployed EduMind Sentinel student wellness application",
  },
  {
    id: "GeneCpGFinder",
    title: "GeneCpGFinder",
    description:
      "An R package for instant lookup across 78,656 human genes from a local ENSEMBL BioMart database, with a pre-curated cancer-gene list — no internet connection required after install.",
    tags: ["R Package", "Bioinformatics", "Genomics"],
    github: "https://github.com/Islam-DS/GeneCpGFinder",
    language: "R",
    codeDemo: {
      command: 'fast_gene_search("TP53")',
      output:
        "FAST: Found in DATABASE - TP53\nhgnc_symbol  chromosome_name  start_position  end_position\nTP53         chr17            7661779         7687546",
    },
  },
  {
    id: "Heart_Disease_Data",
    title: "Heart Disease Detection",
    description:
      "Classical machine learning on the UCI heart-disease dataset (303 patients, 13 clinical features). Logistic Regression and Random Forest compared on accuracy, precision, recall, and F1 — Random Forest reached 82.0% accuracy and 0.853 F1 on the held-out test set.",
    tags: ["Classical ML", "Healthcare", "Classification"],
    github: "https://github.com/Islam-DS/Heart_Disease_Data",
    language: "Jupyter Notebook",
    image: "/images/projects/heart-disease-confusion-matrix.png",
    imageAlt: "Confusion matrix for the Random Forest heart disease classifier",
  },
  {
    id: "Parkinson_Disease",
    title: "Parkinson's Disease Detection",
    description:
      "Detects Parkinson's disease from biomedical voice measurements (UCI dataset, 195 samples). A linear SVM reached 94.9% accuracy and 0.967 F1 on the held-out test set, missing zero Parkinson's cases.",
    tags: ["Classical ML", "Healthcare", "Voice Analysis"],
    github: "https://github.com/Islam-DS/Parkinson_Disease",
    language: "Jupyter Notebook",
    image: "/images/projects/parkinson-confusion-matrix.png",
    imageAlt: "Confusion matrix for the linear SVM Parkinson's disease classifier",
  },
  {
    id: "Genotype_Data_Analysis",
    title: "Epigenetic Age Prediction from Breast Cancer DNA Methylation",
    description:
      "Predicts patient age at diagnosis from DNA methylation (CpG beta values) and clinical metadata in TCGA breast cancer samples, using regularized regression to reduce high-dimensional methylation data to a predictive subset (R² = 0.871) — an epigenetic-clock approach relevant to aging and cancer research.",
    tags: ["Epigenetics", "DNA Methylation", "TCGA"],
    github: "https://github.com/Islam-DS/Genotype_Data_Analysis",
    language: "Jupyter Notebook",
    image: "/images/projects/epigenetic-age-prediction.png",
    imageAlt: "Scatter plot of actual versus predicted DNA methylation age with regression fit, R squared 0.871",
  },
];
