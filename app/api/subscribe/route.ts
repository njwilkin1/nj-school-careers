import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error:
        "Free job alerts have been retired. Priority Job Alerts are available for $9.99/month.",
    },
    { status: 410 }
  );
}
