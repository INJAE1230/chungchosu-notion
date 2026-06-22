import * as XLSX from "xlsx";
import type { AttendanceCategory } from "./hr-types";

const CELL_TO_CATEGORY: Record<string, AttendanceCategory | null> = {
  "정·근": null,
  "정근": null,
  "휴무": "정휴무",
  "관공": "관공휴일",
  "연차": "연차",
  "반차": "반차",
  "대출": "대출",
  "출장": "출장",
  "조퇴": "조퇴",
  "결근": "결근",
  "근로자의날": "근로자의날",
};

const CATEGORY_TO_CELL: Record<string, string> = {
  "정휴무": "휴무",
  "관공휴일": "관공",
  "연차": "연차",
  "반차": "반차",
  "대출": "대출",
  "출장": "출장",
  "조퇴": "조퇴",
  "결근": "결근",
  "근로자의날": "근로자의날",
};

export interface ParsedAttendanceRow {
  name: string;
  department: string;
  position: string;
  records: { date: string; category: AttendanceCategory }[];
}

export function parseAttendanceExcel(buffer: ArrayBuffer): ParsedAttendanceRow[] {
  const wb = XLSX.read(buffer, { type: "array" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  if (!ws) return [];

  const data = XLSX.utils.sheet_to_json<(string | number | null)[]>(ws, { header: 1, defval: null });
  const results: ParsedAttendanceRow[] = [];

  let year = new Date().getFullYear();
  let month = 1;
  let dateColumns: { col: number; date: string }[] = [];

  for (let r = 0; r < data.length; r++) {
    const row = data[r];
    if (!row || row.length === 0) continue;

    const firstCell = String(row[0] || "").trim();
    const secondCell = String(row[1] || "").trim();

    if (secondCell === "구분" || firstCell === "구분") {
      dateColumns = [];
      const startCol = firstCell === "구분" ? 7 : 8;
      for (let c = startCol; c < row.length; c++) {
        const header = String(row[c] || "").trim();
        const match = header.match(/^(\d{1,2})\/(\d{1,2})$/);
        if (match) {
          const m = parseInt(match[1]);
          const d = parseInt(match[2]);
          if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
            month = m;
            const dateStr = `${year}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
            dateColumns.push({ col: c, date: dateStr });
          }
        }
      }
      continue;
    }

    if (firstCell.includes("부") && firstCell.includes("서")) continue;

    if (dateColumns.length === 0) continue;

    const dept = String(row[0] || "").trim();
    const pos = String(row[1] || "").trim();
    const rawName = String(row[2] || "").trim();
    const name = rawName.replace(/\s+/g, "").replace(/\(.*\)$/, "");

    if (!name || name.length < 2) continue;
    if (["구분", "부서", "부 서"].includes(dept)) continue;

    const records: { date: string; category: AttendanceCategory }[] = [];
    for (const { col, date } of dateColumns) {
      const cellVal = String(row[col] || "").trim();
      if (!cellVal) continue;
      const baseVal = cellVal.split("/")[0].split("(")[0].trim();
      const category = CELL_TO_CATEGORY[baseVal];
      if (category) {
        records.push({ date, category });
      }
    }

    if (records.length > 0 || name) {
      results.push({ name, department: dept, position: pos, records });
    }
  }

  return results;
}

export function generateAttendanceExcel(
  monthStr: string,
  sections: {
    entity: string;
    employees: {
      department: string;
      position: string;
      name: string;
      joinDate: string;
      annualLeaveTotal: number;
      dailyRecords: Record<string, string>;
    }[];
  }[]
): ArrayBuffer {
  const wb = XLSX.utils.book_new();
  const [yearStr, monthNum] = monthStr.split("-");
  const year = parseInt(yearStr);
  const month = parseInt(monthNum);
  const daysInMonth = new Date(year, month, 0).getDate();

  const rows: (string | number | null)[][] = [];

  for (const section of sections) {
    const legend = "정·근\t관공\t휴무\t연차\t대출\t출장\t조퇴";
    const entityRow: (string | number | null)[] = new Array(8 + daysInMonth + 1).fill(null);
    entityRow[0] = section.entity;
    entityRow[8] = "정·근";
    entityRow[9] = "관공";
    entityRow[10] = "휴무";
    entityRow[11] = "연차";
    entityRow[12] = "대출";
    entityRow[13] = "출장";
    entityRow[14] = "조퇴";
    rows.push(entityRow);

    const headerRow: (string | number | null)[] = ["구분", "", "", "", "전월 이월 현황", "", "", `${month}월\n발생\n휴무합`];
    for (let d = 1; d <= daysInMonth; d++) {
      headerRow.push(`${month}/${d}`);
    }
    headerRow.push("휴일합");
    rows.push(headerRow);

    const subHeader: (string | number | null)[] = ["부 서", "직급", "성 명", "입사일", "연차", "미*휴", "대출"];
    for (let i = 0; i <= daysInMonth; i++) subHeader.push(null);
    rows.push(subHeader);

    for (const emp of section.employees) {
      const empRow: (string | number | null)[] = [
        emp.department,
        emp.position,
        emp.name,
        emp.joinDate,
        emp.annualLeaveTotal,
        null,
        null,
        null,
      ];

      let restCount = 0;
      for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        const category = emp.dailyRecords[dateStr];
        if (category) {
          const cellVal = CATEGORY_TO_CELL[category] || category;
          empRow.push(cellVal);
          if (["정휴무", "관공휴일", "연차", "반차"].includes(category)) restCount++;
        } else {
          const dow = new Date(year, month - 1, d).getDay();
          if (dow === 0 || dow === 6) {
            empRow.push("휴무");
            restCount++;
          } else {
            empRow.push("정·근");
          }
        }
      }
      empRow[7] = restCount;
      empRow.push(restCount);
      rows.push(empRow);
    }

    rows.push(new Array(8 + daysInMonth + 1).fill(null));
  }

  const ws = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, `${year}년 ${String(month).padStart(2, "0")}`);
  const buf = XLSX.write(wb, { type: "array", bookType: "xlsx" });
  return buf;
}
