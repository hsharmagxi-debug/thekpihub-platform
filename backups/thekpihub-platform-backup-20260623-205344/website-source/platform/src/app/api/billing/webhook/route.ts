import crypto from "node:crypto";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!secret || !supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: "Webhook configuration missing" }, { status: 500 });
  }

  const payload = await request.text();
  const signatureHeader = request.headers.get("stripe-signature");

  if (!signatureHeader) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  const timestamp = signatureHeader
    .split(",")
    .find((part) => part.startsWith("t="))
    ?.slice(2);
  const signature = signatureHeader
    .split(",")
    .find((part) => part.startsWith("v1="))
    ?.slice(3);

  if (!timestamp || !signature) {
    return NextResponse.json({ error: "Invalid signature format" }, { status: 400 });
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}.${payload}`)
    .digest("hex");

  if (expected !== signature) {
    return NextResponse.json({ error: "Webhook verification failed" }, { status: 401 });
  }

  const event = JSON.parse(payload) as {
    type?: string;
    data?: {
      object?: {
        customer_email?: string;
        metadata?: { user_id?: string; plan?: string };
      };
    };
  };

  if (event.type === "checkout.session.completed") {
    const session = event.data?.object;
    const userId = session?.metadata?.user_id;
    const plan = session?.metadata?.plan;

    if (userId && plan) {
      const response = await fetch(
        `${supabaseUrl}/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}`,
        {
          method: "PATCH",
          headers: {
            apikey: serviceRoleKey,
            Authorization: `Bearer ${serviceRoleKey}`,
            "Content-Type": "application/json",
            Prefer: "resolution=merge-duplicates",
          },
          body: JSON.stringify({ plan }),
        }
      );

      if (!response.ok) {
        return NextResponse.json(
          { error: "Failed to update plan in profiles table" },
          { status: 500 }
        );
      }
    }
  }

  return NextResponse.json({ received: true });
}
