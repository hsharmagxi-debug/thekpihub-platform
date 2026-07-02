import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CreateDecisionRequest } from "@/lib/api/contracts";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("decisions")
    .select("*, decision_outcomes(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ decisions: data });
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = (await request.json()) as CreateDecisionRequest;

  if (!body.module_id || !body.headline || !body.category || !body.severity) {
    return NextResponse.json(
      { error: "module_id, headline, category, and severity are required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("decisions")
    .insert({
      user_id: user.id,
      module_id: body.module_id,
      headline: body.headline,
      category: body.category,
      severity: body.severity,
      detail: body.detail ?? null,
      recommendation_id: body.recommendation_id ?? null,
      source_payload: body.source_payload ?? {},
      status: "pending",
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ decision: data }, { status: 201 });
}
