"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PROJECT_COLORS } from "@/lib/constants";
import type { WorkLog } from "@/lib/types";

function getDaysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function getUrgencyLabel(days: number) {
  if (days < 0) return "기한 지남";
  if (days === 0) return "오늘 마감";
  if (days === 1) return "내일 마감";
  return `${days}일 남음`;
}

function getUrgencyColor(days: number) {
  if (days <= 0) return "text-red-500";
  if (days === 1) return "text-orange-500";
  return "text-yellow-600 dark:text-yellow-400";
}

export function UpcomingDeadlines({ logs }: { logs: WorkLog[] }) {
  const upcoming = logs
    .filter((log) => log.status === "예정" && log.date)
    .map((log) => ({ ...log, daysUntil: getDaysUntil(log.date) }))
    .filter((log) => log.daysUntil <= 3)
    .sort((a, b) => a.daysUntil - b.daysUntil);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">마감 임박</CardTitle>
          {upcoming.length > 0 && (
            <span className="text-xs text-red-500 font-medium">{upcoming.length}건</span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {upcoming.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            임박한 마감이 없습니다
          </p>
        ) : (
          <div className="space-y-1">
            {upcoming.map((log) => (
              <Link
                key={log.id}
                href={`/logs/${log.id}`}
                className="flex items-center gap-3 rounded-lg px-2.5 py-2 -mx-2.5 transition-colors hover:bg-accent/50"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{log.title}</p>
                  <p className="text-[11px] text-muted-foreground">{log.date}</p>
                </div>
                <Badge variant="secondary" className={`text-[11px] shrink-0 ${PROJECT_COLORS[log.project]}`}>
                  {log.project}
                </Badge>
                <span className={`text-[11px] font-medium shrink-0 ${getUrgencyColor(log.daysUntil)}`}>
                  {getUrgencyLabel(log.daysUntil)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
