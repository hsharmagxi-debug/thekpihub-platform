import type { RankedRecommendation } from "@/lib/intelligence/types";

export type RecommendationCategory =
  | "Pricing"
  | "Retention"
  | "Expansion"
  | "Product"
  | "Go-to-Market"
  | "New Market";

export interface RecommendationRecord extends RankedRecommendation {
  category: RecommendationCategory;
  likelyCauses: string[];
}

function weightedScore(input: { impact: number; confidence: number; effort: number }) {
  return Math.round(input.impact * 0.45 + input.confidence * 0.35 + (100 - input.effort) * 0.2);
}

const recommendations: Array<Omit<RecommendationRecord, "priorityScore" | "rank">> = [
  {
    id: "rec-pricing-corridor",
    title: "Tighten pricing corridor for SMB tier",
    category: "Pricing",
    issue: "Power users are negotiating deeper discounts while competitor entry pricing drops.",
    likelyCauses: [
      "Discount approvals are inconsistent by segment.",
      "Competitive pricing responses are not centrally coordinated.",
    ],
    recommendedActions: [
      "Freeze exception discounts below the new corridor.",
      "Ship updated sales battlecard by region.",
      "Review close-rate change after 14 days.",
    ],
    expectedImpact: "Protect captured revenue without broadly suppressing conversion.",
    impact: 84,
    effort: 38,
    confidence: 81,
  },
  {
    id: "rec-forecasting-renewals",
    title: "Intervene on renewal cohort at risk",
    category: "Retention",
    issue: "Renewal confidence dropped in onboarding-delayed enterprise accounts.",
    likelyCauses: [
      "Implementation blockers are unresolved late in the cycle.",
      "Renewal owners are not aligned with onboarding health signals.",
    ],
    recommendedActions: [
      "Assign named recovery owners for each flagged account.",
      "Escalate onboarding blockers in the war room.",
      "Run weekly renewal recovery review until confidence improves.",
    ],
    expectedImpact: "Recover expansion revenue before quarter-close planning locks in.",
    impact: 77,
    effort: 34,
    confidence: 74,
  },
  {
    id: "rec-market-shift-onboarding",
    title: "Refresh onboarding narrative for new vertical demand",
    category: "Go-to-Market",
    issue: "Operations-led buyers are converting poorly on generic messaging despite stronger intent.",
    likelyCauses: [
      "Public messaging is too broad for emerging demand clusters.",
      "Proof points for operations teams are missing from the funnel.",
    ],
    recommendedActions: [
      "Create operations-specific landing proof.",
      "Refresh audit funnel messaging for workflow-led use cases.",
      "Track conversion against generic funnel over two weeks.",
    ],
    expectedImpact: "Improve conversion quality for the strongest new demand cluster.",
    impact: 69,
    effort: 29,
    confidence: 72,
  },
  {
    id: "rec-enterprise-onboarding-bundle",
    title: "Bundle implementation services for enterprise deals",
    category: "Expansion",
    issue: "Enterprise prospects stall on rollout risk during procurement.",
    likelyCauses: [
      "No fixed-scope onboarding package exists today.",
      "Procurement teams do not see a clear time-to-value commitment.",
    ],
    recommendedActions: [
      "Package implementation as a fixed-scope offer.",
      "Provide named onboarding contact for first 90 days.",
    ],
    expectedImpact: "Reduce procurement friction and improve close rates on larger deals.",
    impact: 71,
    effort: 45,
    confidence: 66,
  },
  {
    id: "rec-self-serve-team-invites",
    title: "Ship self-serve team invitations",
    category: "Product",
    issue: "Manual seat provisioning is still a trial-to-paid blocker for multi-seat teams.",
    likelyCauses: [
      "Seat creation still depends on support intervention.",
      "No self-serve growth path exists mid-trial.",
    ],
    recommendedActions: [
      "Build a self-serve invite flow.",
      "Let trial admins add seats instantly.",
    ],
    expectedImpact: "Lift conversion for multi-seat prospects with low engineering effort.",
    impact: 65,
    effort: 18,
    confidence: 80,
  },
];

export function getRankedRecommendations(): RecommendationRecord[] {
  return recommendations
    .map((recommendation) => ({
      ...recommendation,
      priorityScore: weightedScore(recommendation),
      rank: 0,
    }))
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .map((recommendation, index) => ({
      ...recommendation,
      rank: index + 1,
    }));
}
