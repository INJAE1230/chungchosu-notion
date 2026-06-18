import { getAllWorkLogs } from "@/lib/notion-service";
import { computeStats } from "@/lib/stats";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { StatusChart } from "@/components/dashboard/status-chart";
import { ProjectChart } from "@/components/dashboard/project-chart";
import { WeeklyChart } from "@/components/dashboard/weekly-chart";
import { RecentLogs } from "@/components/dashboard/recent-logs";
import { QuickMemoInput } from "@/components/memo/quick-memo-input";
import { TodayTasks } from "@/components/dashboard/today-tasks";
import { UpcomingDeadlines } from "@/components/dashboard/upcoming-deadlines";

export const dynamic = "force-dynamic";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 6) return "늦은 밤이에요";
  if (hour < 12) return "좋은 아침이에요";
  if (hour < 18) return "좋은 오후에요";
  return "수고했어요";
}

export default async function DashboardPage() {
  const logs = await getAllWorkLogs();
  const stats = computeStats(logs);
  const recentLogs = logs.slice(0, 5);

  const todayStr = new Date().toISOString().split("T")[0];
  const todayLogs = logs.filter((log) => log.date === todayStr);

  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div>
        <p className="text-sm text-muted-foreground">{today}</p>
        <h1 className="text-xl font-semibold tracking-tight mt-1">
          {getGreeting()} 👋
        </h1>
      </div>

      {/* 핵심 수치 */}
      <SummaryCards stats={stats} />

      {/* 빠른메모 */}
      <QuickMemoInput />

      {/* 오늘의 업무 + 마감 임박 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TodayTasks logs={todayLogs} />
        <UpcomingDeadlines logs={logs} />
      </div>

      {/* 차트 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ProjectChart stats={stats} />
        <StatusChart stats={stats} />
      </div>

      <WeeklyChart stats={stats} />

      {/* 최근 업무 */}
      <RecentLogs logs={recentLogs} />
    </div>
  );
}
