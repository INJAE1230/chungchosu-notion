import { NextResponse } from "next/server";
import { deletePayroll } from "@/lib/payroll-service";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deletePayroll(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("급여 삭제 실패:", error);
    return NextResponse.json({ error: "급여 삭제 실패" }, { status: 500 });
  }
}
