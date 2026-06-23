import { NextResponse } from "next/server";
import { getAllTracks, createTrack } from "@/lib/track-service";
import type { TrackFormData } from "@/lib/types";

export async function GET() {
  try {
    const tracks = await getAllTracks();
    return NextResponse.json(tracks);
  } catch (error) {
    console.error("트랙 목록 조회 실패:", error);
    return NextResponse.json({ error: "트랙 목록 조회 실패" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data: TrackFormData = await request.json();
    const id = await createTrack(data);
    return NextResponse.json({ id });
  } catch (error) {
    console.error("트랙 생성 실패:", error);
    return NextResponse.json({ error: "트랙 생성 실패" }, { status: 500 });
  }
}
