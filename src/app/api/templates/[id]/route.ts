import { NextRequest, NextResponse } from "next/server";
import { updateTemplate, deleteTemplate } from "@/lib/template-service";
import type { RecurringTemplateFormData } from "@/lib/types";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data: Partial<RecurringTemplateFormData> = await request.json();
    await updateTemplate(id, data);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "수정에 실패했습니다";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteTemplate(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "삭제에 실패했습니다";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
