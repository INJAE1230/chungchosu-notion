import { NextResponse } from "next/server";
import { deleteAttendance, getAllAttendance, recalculateLeave } from "@/lib/hr-service";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const allAttendance = await getAllAttendance();
    const record = allAttendance.find((a) => a.id === id);
    const employeeId = record?.employeeId;

    await deleteAttendance(id);

    if (employeeId) {
      await recalculateLeave(employeeId);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("근태 삭제 실패:", error);
    return NextResponse.json({ error: "근태 삭제 실패" }, { status: 500 });
  }
}
