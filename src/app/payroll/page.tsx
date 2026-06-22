import { getAllPayrolls } from "@/lib/payroll-service";
import { PayrollDashboard } from "@/components/payroll/payroll-dashboard";

export default async function PayrollPage() {
  try {
    const records = await getAllPayrolls();
    return <PayrollDashboard initialRecords={records} />;
  } catch (error) {
    console.error("급여 페이지 로드 실패:", error);
    const message = error instanceof Error ? error.message : String(error);
    return (
      <div className="p-8 space-y-4">
        <h1 className="text-xl font-bold text-red-500">급여 페이지 로드 실패</h1>
        <pre className="text-sm bg-accent p-4 rounded-md overflow-auto whitespace-pre-wrap">
          {message}
        </pre>
      </div>
    );
  }
}
