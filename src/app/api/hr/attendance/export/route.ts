import { NextResponse } from "next/server";
import { getAllEmployees, getAllAttendance } from "@/lib/hr-service";
import { generateAttendanceExcel } from "@/lib/excel-attendance";
import { ENTITIES } from "@/lib/constants";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json({ error: "month 파라미터가 필요합니다 (YYYY-MM)" }, { status: 400 });
    }

    const [employees, attendance] = await Promise.all([
      getAllEmployees(),
      getAllAttendance(),
    ]);

    const activeEmployees = employees.filter((e) => e.status === "재직");
    const monthAttendance = attendance.filter((a) => a.date.startsWith(month));

    const attendanceByEmployee = new Map<string, Record<string, string>>();
    for (const a of monthAttendance) {
      if (!a.employeeId) continue;
      if (!attendanceByEmployee.has(a.employeeId)) {
        attendanceByEmployee.set(a.employeeId, {});
      }
      attendanceByEmployee.get(a.employeeId)![a.date] = a.category;
    }

    const entityGroups = new Map<string, typeof activeEmployees>();
    for (const emp of activeEmployees) {
      const entity = emp.entity || "미배정";
      if (!entityGroups.has(entity)) entityGroups.set(entity, []);
      entityGroups.get(entity)!.push(emp);
    }

    const sections = [...entityGroups.entries()].map(([entity, emps]) => ({
      entity,
      employees: emps.map((emp) => ({
        department: emp.department,
        position: emp.position || "",
        name: emp.name,
        joinDate: emp.joinDate,
        annualLeaveTotal: emp.annualLeaveTotal,
        dailyRecords: attendanceByEmployee.get(emp.id) || {},
      })),
    }));

    const buf = generateAttendanceExcel(month, sections);
    const [y, m] = month.split("-");
    const filename = encodeURIComponent(`${y}년 ${parseInt(m)}월 근태현황.xlsx`);

    return new NextResponse(buf, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename*=UTF-8''${filename}`,
      },
    });
  } catch (error) {
    console.error("엑셀 내보내기 실패:", error);
    return NextResponse.json({ error: "엑셀 생성 실패" }, { status: 500 });
  }
}
