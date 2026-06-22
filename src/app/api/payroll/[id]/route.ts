import { NextResponse } from "next/server";
import { deletePayroll, updatePayroll } from "@/lib/payroll-service";
import type { PayrollFormData } from "@/lib/payroll-types";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data: PayrollFormData = await request.json();
    await updatePayroll(id, data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("급여 수정 실패:", error);
    return NextResponse.json({ error: "급여 수정 실패" }, { status: 500 });
  }
}

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
