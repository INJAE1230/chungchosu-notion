import { NextResponse } from "next/server";
import { updateTrack, deleteTrack } from "@/lib/track-service";
import type { TrackFormData } from "@/lib/types";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data: Partial<TrackFormData> = await request.json();
    await updateTrack(id, data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("트랙 수정 실패:", error);
    return NextResponse.json({ error: "트랙 수정 실패" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteTrack(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("트랙 삭제 실패:", error);
    return NextResponse.json({ error: "트랙 삭제 실패" }, { status: 500 });
  }
}
