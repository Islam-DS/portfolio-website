/** Volunteering experience, transcribed from the CV. Newest first. */
export interface VolunteerItem {
  organization: string;
  /** Role as stated in the CV text. */
  role: string;
  period: string;
  startYear: string;
  endYear: string;
  location: string;
  summary: string;
  /** Phrases bolded in the CV — each must appear verbatim in `summary`. */
  emphasis: string[];
}

export const volunteering: VolunteerItem[] = [
  {
    organization: "M.A.D (Making A Difference)",
    role: "Member",
    period: "4 Apr 2019 — Present",
    startYear: "2019",
    endYear: "Now",
    location: "Dhaka",
    summary:
      "As a member of M.A.D. (Making A Difference), I support rural communities in Bangladesh through winter clothing drives, women's empowerment, blood donation campaigns, and flood relief. Our mission is simple: to stand with people in need and make a difference.",
    emphasis: [
      "winter clothing drives, women's empowerment, blood donation campaigns, and flood relief",
      "to stand with people in need and make a difference.",
    ],
  },
  {
    organization: "Red Crescent Society (Govt. Lab)",
    role: "Parade Commander & Unit In-Charge",
    period: "7 Jan 2017 — 4 Feb 2020",
    startYear: "2017",
    endYear: "2020",
    location: "Dhaka",
    summary:
      "As a Parade Commander and Unit In-Charge, I led the national annual parade and received a prestigious award from the City Mayor for my leadership. I also dedicated two hours each week to training and mentoring junior members. Additionally, I am a certified Search and Rescue (SAR) professional, having completed specialized training through the Bangladesh Red Crescent Society and the American Red Cross.",
    emphasis: [
      "led the national annual parade",
      "received a prestigious award",
      "City Mayor",
      "two hours each week",
      "certified Search and Rescue (SAR) professional",
    ],
  },
  {
    organization: "English Club of The Laboratorians (E.C.L)",
    role: "Volunteer Manager & Executive Committee Member",
    period: "7 Jan 2016 — 30 Apr 2019",
    startYear: "2016",
    endYear: "2019",
    location: "Dhaka",
    summary:
      "As Volunteer Manager and Executive Committee member of the English Club of the Laboratorians, I played a central role in organizing a prestigious three-day national English competition. I, along with my team, successfully secured sponsorships from major national corporations and managed a large-scale event that drew students from schools, colleges, and universities across the country. Alongside these executive duties, I dedicated two hours weekly to mentoring junior members, providing specialized training in public speaking and leadership tactics.",
    emphasis: [
      "organizing a prestigious three-day national English competition",
      "secured sponsorships from major national corporations",
      "dedicated two hours weekly to mentoring junior members",
      "public speaking and leadership",
    ],
  },
];
