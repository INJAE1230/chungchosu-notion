import { getAllWorkLogs } from "@/lib/notion-service";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { AchievementList } from "@/components/achievements/achievement-filters";

export const dynamic = "force-dynamic";

export default async function AchievementsPage() {
  const allLogs = await getAllWorkLogs();
  const achievements = allLogs.filter(
    (log) => log.status === "완료" && (log.outcome || log.rating)
  );
  const completedCount = allLogs.filter((l) => l.status === "완료").length;
  const totalHours = achievements.reduce((sum, l) => sum + (l.hours || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Trophy className="h-6 w-6 text-amber-500" />
          성과 관리
        </h1>
        <p className="text-sm text-muted-foreground">
          완료된 업무 {completedCount}건 중 성과 기록 {achievements.length}건
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold text-amber-600">{achievements.length}</p>
            <p className="text-xs text-muted-foreground">성과 기록</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold text-emerald-600">
              {achievements.filter((a) => a.rating === "상").length}
            </p>
            <p className="text-xs text-muted-foreground">상급 성과</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold text-blue-600">
              {Math.round(totalHours * 10) / 10}h
            </p>
            <p className="text-xs text-muted-foreground">총 투입 시간</p>
          </CardContent>
        </Card>
      </div>

      <AchievementList achievements={achievements} />
    </div>
  );
}
