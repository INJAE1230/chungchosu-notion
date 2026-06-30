import { NextRequest, NextResponse } from "next/server";
import { deleteWorkLog } from "@/lib/notion-service";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: trackId } = await params;
    const { logIds } = await request.json();

    if (!trackId) {
      return NextResponse.json({ error: "트랙 ID가 필요합니다" }, { status: 400 });
    }
    if (!Array.isArray(logIds) || logIds.length === 0) {
      return NextResponse.json({ error: "삭제할 업무가 없습니다" }, { status: 400 });
    }

    await Promise.all(logIds.map((logId: string) => deleteWorkLog(logId)));

    return NextResponse.json({ success: true, deleted: logIds.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : "삭제에 실패했습니다";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
