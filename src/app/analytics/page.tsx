import { getAllWorkLogs } from "@/lib/notion-service";
import { BarChart3 } from "lucide-react";
import { AnalyticsWrapper } from "@/components/analytics/analytics-wrapper";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const allLogs = await getAllWorkLogs();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-violet-500" />
          통계 분석
        </h1>
        <p className="text-sm text-muted-foreground">
          전체 {allLogs.length}건의 업무 데이터 분석
        </p>
      </div>

      <AnalyticsWrapper allLogs={allLogs} />
    </div>
  );
}
