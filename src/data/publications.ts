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
  /** Page range from the publisher's record (Crossref). */
  pages?: string;
  /** Key phrases to highlight — each must appear verbatim in the title or
   * abstract; anything that doesn't match is simply not highlighted. */
  highlights?: string[];
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
    pages: "1–6",
    highlights: ["Federated Learning", "Data Heterogeneity", "Multi-Dataset Medical Study"],
  },
  {
    title:
      "Multimodal Ultrasound and Clinical Data for Pediatric Appendicitis: Evaluating Label-Construction Circularity in the Regensburg Benchmark",
    authors: "Md. Mahbubul Islam, Ainur Yerkos",
    venue: "medRxiv",
    year: "2026",
    abstract:
      // Verbatim excerpt of the medRxiv abstract; "…" marks omitted sentences.
      "On the public Regensburg Pediatric Appendicitis Dataset, several recent studies report near-ceiling diagnostic performance using radiologist-interpreted ultrasound findings as tabular model inputs, without processing the underlying images. This raises a question worth answering carefully: how much of that performance reflects genuine diagnostic information, and how much reflects the way this dataset’s outcome labels were constructed? … The multimodal model (pooled AUC 0.894) showed significantly higher discrimination than the backbone-matched image-only (0.789, p < 0.0001) and clinical-only (0.855, p < 0.0001) models. … We then found that the dataset’s own rule for labeling non-surgically-managed patients uses appendix diameter - one of the radiologist-findings predictors - and, separately, the Alvarado and Pediatric Appendicitis Scores - both retained as clinical/multimodal predictors. Removing appendix diameter dropped the radiologist-findings AUC to 0.790; removing the two scores from the multimodal model changed its AUC only marginally, from 0.894 to 0.890, a difference not statistically distinguishable from no change (p = 0.25). Comparing these two corrected models directly, the multimodal model remained significantly higher (0.890 vs. 0.790, p = 6.2 × 10−6). A supplementary check found that 137 of 578 patients (24%) have ultrasound images containing burned-in caliper measurements; on a matched comparison holding the patient set fixed, excluding these images significantly reduced both the image-only and multimodal models’ AUC, indicating a second, image-level information pathway that our design cannot fully attribute to on-screen numeric values versus other differences between marked and unmarked views. …",
    tags: ["Multimodal AI", "Pediatric Ultrasound", "Benchmark Validity"],
    doi: "10.64898/2026.09.30.26364432",
    link: "https://doi.org/10.64898/2026.09.30.26364432",
    type: "Preprint",
    highlights: [
      "Label-Construction Circularity",
      "near-ceiling diagnostic performance",
      "pooled AUC 0.894",
      "uses appendix diameter",
      "137 of 578 patients (24%)",
    ],
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
    highlights: [
      "AI-Driven Diagnostics",
      "non-invasive cancer detection",
      "volatile organic compounds",
      "machine learning and deep learning",
      "lung, breast, and kidney cancer",
    ],
  },
];
