import { NextResponse } from "next/server";
import { getAllAttendance, createAttendance, recalculateLeave } from "@/lib/hr-service";

export async function GET() {
  try {
    const records = await getAllAttendance();
    return NextResponse.json(records);
  } catch (error) {
    console.error("근태 기록 조회 실패:", error);
    return NextResponse.json({ error: "근태 기록 조회 실패" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { formData, employeeName } = await request.json();
    const id = await createAttendance(formData, employeeName);
    await recalculateLeave(formData.employeeId);
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    console.error("근태 기록 실패:", error);
    return NextResponse.json({ error: "근태 기록 실패" }, { status: 500 });
  }
}
