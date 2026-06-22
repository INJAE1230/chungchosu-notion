import { NextResponse } from "next/server";
import { getAllPayrolls, createPayroll } from "@/lib/payroll-service";
import type { PayrollFormData } from "@/lib/payroll-types";

export async function GET() {
  try {
    const records = await getAllPayrolls();
    return NextResponse.json(records);
  } catch (error) {
    console.error("급여 목록 조회 실패:", error);
    return NextResponse.json({ error: "급여 목록 조회 실패" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data: PayrollFormData = await request.json();
    const id = await createPayroll(data);
    return NextResponse.json({ id });
  } catch (error) {
    console.error("급여 등록 실패:", error);
    return NextResponse.json({ error: "급여 등록 실패" }, { status: 500 });
  }
}
