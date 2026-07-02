import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { UpdateDecisionStatusRequest } from "@/lib/api/contracts";

const allowedStatuses = new Set(["pending", "accepted", "snoozed", "dismissed"]);

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = (await request.json()) as UpdateDecisionStatusRequest;

  if (!allowedStatuses.has(body.status)) {
    return NextResponse.json({ error: "Invalid decision status" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("decisions")
    .update({
      status: body.status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ decision: data });
}
