import { Project } from "@/data/projects";

/**
 * Manual enrichment for specific GitHub repos, keyed by exact repo name.
 * Anything not listed here still shows up automatically (repo description,
 * language, stars) as long as it's tagged "portfolio" on GitHub — this map
 * only exists to layer curated descriptions/images/demos on top.
 */
export const projectOverrides: Record<string, Partial<Project>> = {
  "Med_AI-bias-audit": {
    title: "Subgroup Bias & Failure-Mode Audit of a Chest X-ray Classifier",
    description:
      "Trained a ConvNeXt-Tiny multi-label classifier on NIH ChestX-ray14, then audited where it fails rather than stopping at overall accuracy — 14 statistically significant subgroup AUROC gaps found across sex, age, and imaging view (e.g. Pneumothorax: 0.831 AUROC on PA view vs 0.680 on AP, p=0.002), with Equalized Odds fairness gaps, post-hoc calibration (temperature scaling), and Captum saliency maps explaining why. Published on Zenodo.",
    tags: ["Fairness Audit", "Explainable AI", "Chest X-ray"],
    language: "Python",
    featured: true,
    image: "/images/projects/bias-audit-auroc-view-position.png",
    imageAlt:
      "Bar chart of AUROC by imaging view position (PA vs AP) across five chest X-ray findings, showing significant subgroup performance gaps",
    pipeline: [
      { icon: "scan", label: "Train Classifier", detail: "ConvNeXt-Tiny on NIH ChestX-ray14, 14 findings" },
      { icon: "users", label: "Audit Subgroups", detail: "14 significant AUROC gaps by sex, age, view" },
      { icon: "scale", label: "Fairness + Calibration", detail: "Equalized Odds gaps, temperature scaling" },
      { icon: "eye", label: "Explain", detail: "Captum saliency maps for each failure mode" },
    ],
  },
  "pediatric-appendicitis-multimodal-ai": {
    title: "Pediatric Appendicitis Multimodal AI",
    description:
      "Leakage-aware multimodal machine learning framework integrating clinical assessment, laboratory biomarkers, and ultrasound imaging for pediatric appendicitis diagnosis. The multimodal fusion model reached AUC 0.896, outperforming clinical-only (0.849) and image-only (0.756) baselines, with patient-level leakage prevention, calibration analysis, and decision curve analysis. Co-authored with Ainur Yerkos and Zhandos Buribayev.",
    tags: ["Multimodal AI", "Medical AI", "Clinical ML"],
    language: "Jupyter Notebook",
    image: "/images/projects/pediatric-appendicitis-roc.png",
    imageAlt:
      "ROC and precision-recall curves comparing clinical, image-only, and multimodal models for pediatric appendicitis diagnosis",
  },
  "brca-singlecell-pam50": {
    title: "Single-Cell Breast Cancer PAM50 Subtype Classifier",
    description:
      "Predicts clinically important breast cancer molecular subtypes (Luminal A/B, HER2-enriched, Basal-like) from single-cell gene expression using a public epithelial cell atlas and an interpretable multiclass logistic regression model.",
    tags: ["Oncology AI", "Single-Cell", "Interpretable ML"],
    language: "Jupyter Notebook",
    image: "/images/projects/brca-pam50-umap.png",
    imageAlt: "UMAP projection of single-cell breast cancer data colored by predicted PAM50 molecular subtype",
  },
  "EduMind-Sentinel": {
    title: "EduMind Sentinel",
    description:
      "AI-powered student wellness platform that identifies emotional wellness risk patterns from behavioral, academic, and lifestyle indicators, with an explainable AI dashboard and crisis-support resources. Deployed as a live application.",
    tags: ["Explainable AI", "Wellness Tech", "Streamlit"],
    demo: "https://edumind-sentinel-gvozxzoxwwxiujuyzrl3wk.streamlit.app/",
    language: "Python",
    image: "/images/projects/edumind-sentinel-homepage.png",
    imageAlt: "Homepage screenshot of the deployed EduMind Sentinel student wellness application",
  },
  GeneCpGFinder: {
    title: "GeneCpGFinder",
    description:
      "An R package for instant lookup across 78,656 human genes from a local ENSEMBL BioMart database, with a pre-curated cancer-gene list — no internet connection required after install.",
    tags: ["R Package", "Bioinformatics", "Genomics"],
    language: "R",
    codeDemo: {
      command: 'fast_gene_search("TP53")',
      output:
        "FAST: Found in DATABASE - TP53\nhgnc_symbol  chromosome_name  start_position  end_position\nTP53         chr17            7661779         7687546",
    },
  },
  Heart_Disease_Data: {
    title: "Heart Disease Detection",
    description:
      "Classical machine learning on the UCI heart-disease dataset (303 patients, 13 clinical features). Logistic Regression and Random Forest compared on accuracy, precision, recall, and F1 — Random Forest reached 82.0% accuracy and 0.853 F1 on the held-out test set.",
    tags: ["Classical ML", "Healthcare", "Classification"],
    language: "Jupyter Notebook",
    image: "/images/projects/heart-disease-confusion-matrix.png",
    imageAlt: "Confusion matrix for the Random Forest heart disease classifier",
  },
  Parkinson_Disease: {
    title: "Parkinson's Disease Detection",
    description:
      "Detects Parkinson's disease from biomedical voice measurements (UCI dataset, 195 samples). A linear SVM reached 94.9% accuracy and 0.967 F1 on the held-out test set, missing zero Parkinson's cases.",
    tags: ["Classical ML", "Healthcare", "Voice Analysis"],
    language: "Jupyter Notebook",
    image: "/images/projects/parkinson-confusion-matrix.png",
    imageAlt: "Confusion matrix for the linear SVM Parkinson's disease classifier",
  },
  Genotype_Data_Analysis: {
    title: "Epigenetic Age Prediction from Breast Cancer DNA Methylation",
    description:
      "Predicts patient age at diagnosis from DNA methylation (CpG beta values) and clinical metadata in TCGA breast cancer samples, using regularized regression to reduce high-dimensional methylation data to a predictive subset (R² = 0.871) — an epigenetic-clock approach relevant to aging and cancer research.",
    tags: ["Epigenetics", "DNA Methylation", "TCGA"],
    language: "Jupyter Notebook",
    image: "/images/projects/epigenetic-age-prediction.png",
    imageAlt: "Scatter plot of actual versus predicted DNA methylation age with regression fit, R squared 0.871",
  },
};
