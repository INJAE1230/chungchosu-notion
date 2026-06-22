import { NextResponse } from "next/server";
import { getAllAttendance, createAttendanceBulk } from "@/lib/hr-service";

export async function POST(request: Request) {
  try {
    const { records } = await request.json() as {
      records: { employeeId: string; employeeName: string; date: string; category: string }[];
    };

    if (!records?.length) {
      return NextResponse.json({ error: "등록할 기록이 없습니다" }, { status: 400 });
    }

    const existing = await getAllAttendance();
    const existingSet = new Set(
      existing.map((a) => `${a.employeeId}_${a.date}`)
    );

    const filtered = records.filter(
      (r) => !existingSet.has(`${r.employeeId}_${r.date}`)
    );

    if (filtered.length === 0) {
      return NextResponse.json({ created: 0, message: "이미 모든 기록이 존재합니다" });
    }

    const created = await createAttendanceBulk(filtered);
    return NextResponse.json({ created });
  } catch (error) {
    console.error("일괄 등록 실패:", error);
    return NextResponse.json({ error: "일괄 등록 실패" }, { status: 500 });
  }
}
