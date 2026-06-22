import { notion } from "./notion";
import { ENTITIES } from "./constants";
import type { Entity } from "./constants";
import type {
  Employee,
  EmployeeFormData,
  AttendanceRecord,
  AttendanceFormData,
  EmploymentStatus,
  Position,
  AttendanceCategory,
} from "./hr-types";
import { parseDeductionMethod, encodeDeductionMethod, calculateRemainingLeave } from "./leave-utils";

const employeeDbId = process.env.NOTION_HR_EMPLOYEE_DB_ID!;
const attendanceDbId = process.env.NOTION_HR_ATTENDANCE_DB_ID!;

let cachedEmployeeDsId: string | null = null;
let cachedAttendanceDsId: string | null = null;

async function getEmployeeDsId(): Promise<string> {
  if (cachedEmployeeDsId) return cachedEmployeeDsId;
  const db = await notion.databases.retrieve({ database_id: employeeDbId }) as Record<string, unknown>;
  const ds = db.data_sources as { id: string }[];
  cachedEmployeeDsId = ds[0].id;
  return cachedEmployeeDsId;
}

async function getAttendanceDsId(): Promise<string> {
  if (cachedAttendanceDsId) return cachedAttendanceDsId;
  const db = await notion.databases.retrieve({ database_id: attendanceDbId }) as Record<string, unknown>;
  const ds = db.data_sources as { id: string }[];
  cachedAttendanceDsId = ds[0].id;
  return cachedAttendanceDsId;
}

interface NotionPage {
  id: string;
  properties: Record<string, unknown>;
}

const VALID_ENTITIES = new Set(ENTITIES);

function mapEmployee(page: NotionPage): Employee {
  const p = page.properties as Record<string, Record<string, unknown>>;

  const titleArr = p["이름"]?.title as { plain_text: string }[] | undefined;
  const entityObj = p["법인"]?.select as { name: string } | null | undefined;
  const deptText = p["부서"]?.rich_text as { plain_text: string }[] | undefined;
  const positionObj = p["직급"]?.select as { name: string } | null | undefined;
  const dateObj = p["입사일"]?.date as { start: string } | null | undefined;
  const statusObj = p["재직상태"]?.select as { name: string } | null | undefined;
  const leaveTotal = p["연차발생일수"]?.number as number | null | undefined;
  const leaveRemain = p["잔여연차"]?.number as number | null | undefined;
  const restDaysText = p["정휴무요일"]?.rich_text as { plain_text: string }[] | undefined;

  const entityName = entityObj?.name;
  const restDaysStr = restDaysText?.[0]?.plain_text || "";
  const restDays = restDaysStr
    ? restDaysStr.split(/[,\s·\/]+/).map((s) => s.trim().replace(/요일$/, "")).filter(Boolean)
    : [];

  return {
    id: page.id,
    name: titleArr?.[0]?.plain_text || "",
    entity: (entityName && VALID_ENTITIES.has(entityName as Entity)) ? entityName as Entity : null,
    department: deptText?.[0]?.plain_text || "",
    position: (positionObj?.name as Position) || null,
    joinDate: dateObj?.start || "",
    status: (statusObj?.name as EmploymentStatus) || "재직",
    annualLeaveTotal: leaveTotal ?? 15,
    remainingLeave: leaveRemain ?? 0,
    restDays,
  };
}

function mapAttendance(page: NotionPage): AttendanceRecord {
  const p = page.properties as Record<string, Record<string, unknown>>;

  const titleArr = p["제목"]?.title as { plain_text: string }[] | undefined;
  const empRelation = p["직원"]?.relation as { id: string }[] | undefined;
  const dateObj = p["날짜"]?.date as { start: string } | null | undefined;
  const categoryObj = p["구분"]?.select as { name: string } | null | undefined;
  const noteText = p["비고"]?.rich_text as { plain_text: string }[] | undefined;

  const note = noteText?.[0]?.plain_text || "";
  const category = (categoryObj?.name as AttendanceCategory) || "정상근무";

  return {
    id: page.id,
    title: titleArr?.[0]?.plain_text || "",
    employeeId: empRelation?.[0]?.id || null,
    date: dateObj?.start || "",
    category,
    note,
    deductionMethod: category === "조퇴" ? parseDeductionMethod(note) : undefined,
  };
}

// ── Employee CRUD ──

export async function getAllEmployees(): Promise<Employee[]> {
  const dsId = await getEmployeeDsId();
  const allResults: NotionPage[] = [];
  let cursor: string | undefined;

  do {
    const query: Record<string, unknown> = {
      data_source_id: dsId,
      sorts: [{ property: "이름", direction: "ascending" }],
      page_size: 100,
    };
    if (cursor) query.start_cursor = cursor;

    const response = await (notion.dataSources as Record<string, Function>).query(query);
    const typed = response as { results: NotionPage[]; has_more: boolean; next_cursor: string | null };
    allResults.push(...typed.results);
    cursor = typed.has_more && typed.next_cursor ? typed.next_cursor : undefined;
  } while (cursor);

  return allResults.map(mapEmployee);
}

export async function createEmployee(data: EmployeeFormData): Promise<string> {
  const properties: Record<string, unknown> = {
    "이름": { title: [{ text: { content: data.name } }] },
    "입사일": { date: { start: data.joinDate } },
    "재직상태": { select: { name: data.status } },
    "연차발생일수": { number: data.annualLeaveTotal },
    "잔여연차": { number: data.annualLeaveTotal },
  };

  if (data.entity) properties["법인"] = { select: { name: data.entity } };
  if (data.department) properties["부서"] = { rich_text: [{ text: { content: data.department } }] };
  if (data.position) properties["직급"] = { select: { name: data.position } };
  if (data.restDays?.length) properties["정휴무요일"] = { rich_text: [{ text: { content: data.restDays.join(",") } }] };

  const page = await notion.pages.create({
    parent: { database_id: employeeDbId },
    properties,
  } as Parameters<typeof notion.pages.create>[0]);
  return page.id;
}

export async function updateEmployee(id: string, data: Partial<EmployeeFormData>): Promise<void> {
  const properties: Record<string, unknown> = {};

  if (data.name !== undefined) properties["이름"] = { title: [{ text: { content: data.name } }] };
  if (data.entity !== undefined) properties["법인"] = data.entity ? { select: { name: data.entity } } : { select: null };
  if (data.department !== undefined) properties["부서"] = { rich_text: [{ text: { content: data.department } }] };
  if (data.position !== undefined) properties["직급"] = data.position ? { select: { name: data.position } } : { select: null };
  if (data.joinDate !== undefined) properties["입사일"] = { date: { start: data.joinDate } };
  if (data.status !== undefined) properties["재직상태"] = { select: { name: data.status } };
  if (data.annualLeaveTotal !== undefined) properties["연차발생일수"] = { number: data.annualLeaveTotal };
  if (data.restDays !== undefined) properties["정휴무요일"] = { rich_text: [{ text: { content: data.restDays.join(",") } }] };

  await notion.pages.update({
    page_id: id,
    properties,
  } as Parameters<typeof notion.pages.update>[0]);
}

export async function patchRemainingLeave(employeeId: string, remainingLeave: number): Promise<void> {
  await notion.pages.update({
    page_id: employeeId,
    properties: { "잔여연차": { number: remainingLeave } },
  } as Parameters<typeof notion.pages.update>[0]);
}

export async function deleteEmployee(id: string): Promise<void> {
  await notion.pages.update({
    page_id: id,
    in_trash: true,
  } as Parameters<typeof notion.pages.update>[0]);
}

// ── Attendance CRUD ──

export async function getAllAttendance(): Promise<AttendanceRecord[]> {
  const dsId = await getAttendanceDsId();
  const allResults: NotionPage[] = [];
  let cursor: string | undefined;

  do {
    const query: Record<string, unknown> = {
      data_source_id: dsId,
      sorts: [{ property: "날짜", direction: "descending" }],
      page_size: 100,
    };
    if (cursor) query.start_cursor = cursor;

    const response = await (notion.dataSources as Record<string, Function>).query(query);
    const typed = response as { results: NotionPage[]; has_more: boolean; next_cursor: string | null };
    allResults.push(...typed.results);
    cursor = typed.has_more && typed.next_cursor ? typed.next_cursor : undefined;
  } while (cursor);

  return allResults.map(mapAttendance);
}

export async function createAttendance(data: AttendanceFormData, employeeName: string): Promise<string> {
  const title = `${employeeName} - ${data.category}`;
  const note = data.category === "조퇴" && data.deductionMethod
    ? encodeDeductionMethod(data.deductionMethod, data.note)
    : data.note;

  const properties: Record<string, unknown> = {
    "제목": { title: [{ text: { content: title } }] },
    "직원": { relation: [{ id: data.employeeId }] },
    "날짜": { date: { start: data.date } },
    "구분": { select: { name: data.category } },
    "비고": { rich_text: [{ text: { content: note || "" } }] },
  };

  const page = await notion.pages.create({
    parent: { database_id: attendanceDbId },
    properties,
  } as Parameters<typeof notion.pages.create>[0]);
  return page.id;
}

export async function deleteAttendance(id: string): Promise<void> {
  await notion.pages.update({
    page_id: id,
    in_trash: true,
  } as Parameters<typeof notion.pages.update>[0]);
}

// ── Bulk attendance creation ──

export async function createAttendanceBulk(
  records: { employeeId: string; employeeName: string; date: string; category: string }[]
): Promise<number> {
  let created = 0;
  for (const rec of records) {
    const title = `${rec.employeeName} - ${rec.category}`;
    const properties: Record<string, unknown> = {
      "제목": { title: [{ text: { content: title } }] },
      "직원": { relation: [{ id: rec.employeeId }] },
      "날짜": { date: { start: rec.date } },
      "구분": { select: { name: rec.category } },
      "비고": { rich_text: [{ text: { content: "" } }] },
    };
    await notion.pages.create({
      parent: { database_id: attendanceDbId },
      properties,
    } as Parameters<typeof notion.pages.create>[0]);
    created++;
  }
  return created;
}

// ── Leave recalculation ──

export async function recalculateLeave(employeeId: string): Promise<number> {
  const [employees, allAttendance] = await Promise.all([
    getAllEmployees(),
    getAllAttendance(),
  ]);

  const emp = employees.find((e) => e.id === employeeId);
  if (!emp) throw new Error("직원을 찾을 수 없습니다");

  const empRecords = allAttendance.filter((a) => a.employeeId === employeeId);
  const remaining = calculateRemainingLeave(emp.annualLeaveTotal, empRecords);

  await patchRemainingLeave(employeeId, remaining);
  return remaining;
}
