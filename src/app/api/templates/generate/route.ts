import { NextRequest, NextResponse } from "next/server";
import { generateWorkLogs } from "@/lib/template-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const mode: "오늘" | "이번주" | "이번달" | "이번분기" | "이번반기" | "올해" = body.mode;
    const templateIds: string[] | undefined = body.templateIds;

    const validModes = ["오늘", "이번주", "이번달", "이번분기", "이번반기", "올해"];
    if (!validModes.includes(mode)) {
      return NextResponse.json(
        { error: "유효하지 않은 mode입니다" },
        { status: 400 }
      );
    }

    const result = await generateWorkLogs(mode, templateIds);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "생성에 실패했습니다";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
