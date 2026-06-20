import { NextRequest, NextResponse } from "next/server";
import { generateAutoWorkLogs } from "@/lib/template-service";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await generateAutoWorkLogs();
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "자동 생성 실패";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
