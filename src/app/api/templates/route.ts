import { NextRequest, NextResponse } from "next/server";
import { getAllTemplates, createTemplate } from "@/lib/template-service";
import type { RecurringTemplateFormData } from "@/lib/types";

export async function GET() {
  try {
    const templates = await getAllTemplates();
    return NextResponse.json(templates);
  } catch (error) {
    const message = error instanceof Error ? error.message : "조회에 실패했습니다";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: RecurringTemplateFormData = await request.json();
    const id = await createTemplate(data);
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "추가에 실패했습니다";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
