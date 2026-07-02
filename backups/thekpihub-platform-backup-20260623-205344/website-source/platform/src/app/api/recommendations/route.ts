import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getRankedRecommendations } from "@/lib/intelligence/mockRecommendationEngine";

type AccuracySummary = {
  success_count: number;
  partial_success_count: number;
  failed_count: number;
  total_scored: number;
  score: number;
};

function calculateAccuracy(decisions: Array<{ result: "success" | "partial_success" | "failed" }>): AccuracySummary {
  const summary = {
    success_count: 0,
    partial_success_count: 0,
    failed_count: 0,
    total_scored: decisions.length,
    score: 0,
  };

  decisions.forEach((decision) => {
    if (decision.result === "success") summary.success_count += 1;
    if (decision.result === "partial_success") summary.partial_success_count += 1;
    if (decision.result === "failed") summary.failed_count += 1;
  });

  if (summary.total_scored > 0) {
    const weighted =
      summary.success_count * 1 + summary.partial_success_count * 0.5 + summary.failed_count * 0;
    summary.score = Math.round((weighted / summary.total_scored) * 100);
  }

  return summary;
}

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const recommendations = getRankedRecommendations();

  const { data, error } = await supabase
    .from("decisions")
    .select("recommendation_id, decision_outcomes(result)")
    .eq("user_id", user.id)
    .not("recommendation_id", "is", null);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const byRecommendation = new Map<string, Array<{ result: "success" | "partial_success" | "failed" }>>();

  (data ?? []).forEach((row) => {
    const recommendationId = row.recommendation_id as string | null;
    const outcome = Array.isArray(row.decision_outcomes) ? row.decision_outcomes[0] : null;
    if (!recommendationId || !outcome?.result) return;
    const current = byRecommendation.get(recommendationId) ?? [];
    current.push({ result: outcome.result });
    byRecommendation.set(recommendationId, current);
  });

  const enriched = recommendations.map((recommendation) => ({
    ...recommendation,
    accuracy: calculateAccuracy(byRecommendation.get(recommendation.id) ?? []),
  }));

  return NextResponse.json({ recommendations: enriched });
}
