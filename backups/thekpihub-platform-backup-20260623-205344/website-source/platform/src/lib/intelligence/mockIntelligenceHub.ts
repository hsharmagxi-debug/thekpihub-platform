import type {
  DecisionFeedEntry,
  ExecutiveBrief,
  IntelligenceHubSnapshot,
  ModuleSignal,
  RankedRecommendation,
  StrategicHeatmapRow,
} from "@/lib/intelligence/types";

const actionQueue: RankedRecommendation[] = [
  {
    id: "rec-pricing-corridor",
    title: "Tighten pricing corridor for SMB tier",
    issue: "Pipeline expansion is healthy, but price sensitivity increased after competitor discounting.",
    impact: 84,
    effort: 38,
    confidence: 81,
    rank: 1,
    expectedImpact: "Protect revenue while reducing discount leakage over the next 30 days.",
    priorityScore: 91,
    recommendedActions: [
      "Pause ad-hoc discount approvals below 12%.",
      "Ship revised pricing battlecard to sales leadership.",
      "Compare close-rate impact by segment after 14 days.",
    ],
  },
  {
    id: "rec-forecasting-renewals",
    title: "Intervene on renewal cohort at risk",
    issue: "Forecasting center shows weakening confidence in the May-June renewal group.",
    impact: 77,
    effort: 34,
    confidence: 74,
    rank: 2,
    expectedImpact: "Recover at-risk expansion revenue before end-of-quarter planning locks.",
    priorityScore: 83,
    recommendedActions: [
      "Pull churn-risk accounts into the executive war room.",
      "Assign retention owners by segment.",
      "Add weekly recovery review until risk drops below threshold.",
    ],
  },
  {
    id: "rec-market-shift-onboarding",
    title: "Refresh onboarding narrative for new vertical demand",
    issue: "Market shift signals show inbound demand moving faster in operations-heavy teams.",
    impact: 69,
    effort: 29,
    confidence: 72,
    rank: 3,
    expectedImpact: "Improve conversion on new segment traffic while keeping acquisition efficient.",
    priorityScore: 76,
    recommendedActions: [
      "Update hero messaging for operations-led buyers.",
      "Launch one vertical proof page.",
      "Track conversion lift versus current generic funnel.",
    ],
  },
];

const decisionFeed: DecisionFeedEntry[] = [
  {
    id: "df-pricing-corridor",
    moduleId: "recommendation-engine",
    moduleLabel: "Recommendation Engine",
    href: "/dashboard/recommendation-engine",
    category: "recommendation",
    severity: "high",
    timestamp: "2026-06-23T07:30:00.000Z",
    headline: "Recommendation engine flags discount leakage in SMB deals",
    detail: "Average approved discount increased 4.2 points this week, reducing expected captured revenue.",
    relatedRecommendationId: "rec-pricing-corridor",
  },
  {
    id: "df-renewal-confidence",
    moduleId: "forecasting-center",
    moduleLabel: "Forecasting Center",
    href: "/dashboard/forecasting-center",
    category: "risk",
    severity: "high",
    timestamp: "2026-06-23T06:10:00.000Z",
    headline: "Renewal confidence dropped for two enterprise cohorts",
    detail: "Expected expansion softened in accounts with delayed onboarding milestones.",
    relatedRecommendationId: "rec-forecasting-renewals",
  },
  {
    id: "df-market-shift-demand",
    moduleId: "market-shift",
    moduleLabel: "Market Shift Engine",
    href: "/dashboard/market-shift",
    category: "opportunity",
    severity: "medium",
    timestamp: "2026-06-23T05:40:00.000Z",
    headline: "Inbound demand shifted toward operations-heavy teams",
    detail: "Opportunity radar and market shift trends align on a stronger operations-led buyer profile.",
    relatedRecommendationId: "rec-market-shift-onboarding",
  },
  {
    id: "df-war-room-retention",
    moduleId: "executive-war-room",
    moduleLabel: "Executive War Room",
    href: "/dashboard/executive-war-room",
    category: "risk",
    severity: "medium",
    timestamp: "2026-06-23T04:55:00.000Z",
    headline: "Executive war room escalated three retention blockers",
    detail: "Two customers require pricing exception review and one needs onboarding intervention.",
  },
  {
    id: "df-opportunity-radar-vertical",
    moduleId: "opportunity-radar",
    moduleLabel: "Opportunity Radar",
    href: "/dashboard/opportunity-radar",
    category: "opportunity",
    severity: "medium",
    timestamp: "2026-06-23T03:35:00.000Z",
    headline: "Opportunity radar ranks logistics workflow teams as top expansion wedge",
    detail: "New market ranking increased after competitor feature gaps widened in workflow visibility.",
  },
];

const heatmap: StrategicHeatmapRow[] = [
  { id: "market-shift", label: "Market Shift", opportunity: 82, risk: 44, momentum: 75, confidence: 71 },
  { id: "forecasting-center", label: "Forecasting Center", opportunity: 58, risk: 76, momentum: 53, confidence: 80 },
  { id: "recommendation-engine", label: "Recommendation Engine", opportunity: 88, risk: 49, momentum: 84, confidence: 79 },
  { id: "executive-war-room", label: "Executive War Room", opportunity: 62, risk: 81, momentum: 61, confidence: 73 },
  { id: "opportunity-radar", label: "Opportunity Radar", opportunity: 85, risk: 42, momentum: 78, confidence: 68 },
];

const signals: ModuleSignal[] = [
  {
    id: "opportunity-radar",
    label: "Opportunity Radar",
    href: "/dashboard/opportunity-radar",
    headlineMetric: "Logistics vertical up 18%",
    trend: "accelerating",
    severity: "medium",
    summary: "New segment demand is clustering around workflow-visibility problems.",
    live: true,
  },
  {
    id: "executive-war-room",
    label: "Executive War Room",
    href: "/dashboard/executive-war-room",
    headlineMetric: "3 retention blockers escalated",
    trend: "stable",
    severity: "high",
    summary: "Leadership attention is needed on exceptions that affect renewal confidence.",
    live: true,
  },
  {
    id: "competitor-dna",
    label: "Competitor DNA Explorer",
    href: "/dashboard/competitor-dna",
    headlineMetric: "Competitor X cut entry-tier pricing 12%",
    trend: "accelerating",
    severity: "high",
    summary: "The pricing move is influencing SMB discount behavior in active pipeline deals.",
  },
  {
    id: "market-shift",
    label: "Market Shift Engine",
    href: "/dashboard/market-shift",
    headlineMetric: "Ops-led buyer intent increasing",
    trend: "accelerating",
    severity: "medium",
    summary: "Landing-page and narrative alignment now matter more than broad persona messaging.",
    live: true,
  },
  {
    id: "forecasting-center",
    label: "Forecasting Center",
    href: "/dashboard/forecasting-center",
    headlineMetric: "2 cohorts flagged at risk",
    trend: "declining",
    severity: "high",
    summary: "Renewal confidence weakened in cohorts with incomplete onboarding milestones.",
    live: true,
  },
  {
    id: "recommendation-engine",
    label: "Recommendation Engine",
    href: "/dashboard/recommendation-engine",
    headlineMetric: "Top action score 91",
    trend: "stable",
    severity: "medium",
    summary: "Recommended action priority remains concentrated around pricing discipline and retention.",
    live: true,
  },
  {
    id: "knowledge-graph",
    label: "Knowledge Graph Explorer",
    href: "/dashboard/knowledge-graph",
    headlineMetric: "120 new entity links",
    trend: "stable",
    severity: "low",
    summary: "Exploration modules remain placeholder signals until Tier 3 resumes.",
  },
];

function buildExecutiveBrief(): ExecutiveBrief {
  const keyOpportunities = decisionFeed
    .filter((entry) => entry.category === "opportunity")
    .slice(0, 3)
    .map((entry) => entry.headline);
  const keyRisks = decisionFeed
    .filter((entry) => entry.category === "risk")
    .slice(0, 3)
    .map((entry) => entry.headline);

  return {
    headline:
      "2 risk signals and 2 opportunity signals are active across live modules. Top priority: tighten pricing corridor for the SMB tier.",
    keyOpportunities,
    keyRisks,
    recommendedActions: actionQueue.slice(0, 3).map((item) => item.title),
  };
}

export function rankSignalsBySeverity(signalsToRank: ModuleSignal[]) {
  const score = { high: 3, medium: 2, low: 1 } as const;
  return [...signalsToRank]
    .sort((a, b) => score[b.severity] - score[a.severity])
    .map((signal, index) => ({ ...signal, rank: index + 1 }));
}

export function buildIntelligenceHubSnapshot(): IntelligenceHubSnapshot {
  return {
    signals,
    executiveBrief: buildExecutiveBrief(),
    decisionFeed,
    heatmap,
    actionQueue,
  };
}

export function findRecommendationById(recommendationId?: string) {
  return actionQueue.find((item) => item.id === recommendationId) ?? null;
}
