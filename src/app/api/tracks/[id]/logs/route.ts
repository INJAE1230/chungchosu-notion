import { NextRequest, NextResponse } from "next/server";
import { deleteWorkLog } from "@/lib/notion-service";

const BULK_DELETE_PASSWORD = process.env.BULK_DELETE_PASSWORD ?? "";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: trackId } = await params;
    const { password, logIds } = await request.json();

    if (!trackId) {
      return NextResponse.json({ error: "트랙 ID가 필요합니다" }, { status: 400 });
    }
    if (password !== BULK_DELETE_PASSWORD) {
      return NextResponse.json({ error: "비밀번호가 틀렸습니다" }, { status: 403 });
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
