import { NextResponse } from "next/server";
import { buildIntelligenceHubSnapshot } from "@/lib/intelligence/mockIntelligenceHub";

export async function GET() {
  return NextResponse.json({
    snapshot: buildIntelligenceHubSnapshot(),
  });
}
