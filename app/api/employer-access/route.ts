import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: orders, error } = await supabase
      .from("employer_orders")
      .select("*")
      .eq("employer_email", email.toLowerCase())
      .eq("status", "active");

    if (error) {
      console.error(error);

      return NextResponse.json(
        { error: "Failed to verify access." },
        { status: 500 }
      );
    }

    const now = new Date();

    const activeOrder = orders?.find((order) => {
      const hasRemainingPosts =
        order.remaining_posts && order.remaining_posts > 0;

      const hasUnlimitedAccess =
        order.unlimited_until &&
        new Date(order.unlimited_until) > now;

      return hasRemainingPosts || hasUnlimitedAccess;
    });

    if (!activeOrder) {
      return NextResponse.json(
        { error: "No active employer plan found." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      order: activeOrder,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Server error." },
      { status: 500 }
    );
  }
}