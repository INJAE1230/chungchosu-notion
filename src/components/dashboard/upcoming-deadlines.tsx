"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PROJECT_COLORS } from "@/lib/constants";
import { AlertTriangle } from "lucide-react";
import type { WorkLog } from "@/lib/types";

function getDaysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function getUrgencyStyle(days: number) {
  if (days <= 0) return "border-l-red-500 bg-red-50/50 dark:bg-red-950/20";
  if (days === 1) return "border-l-orange-500 bg-orange-50/50 dark:bg-orange-950/20";
  return "border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20";
}

function getUrgencyLabel(days: number) {
  if (days < 0) return "기한 지남";
  if (days === 0) return "오늘 마감";
  if (days === 1) return "내일 마감";
  return `${days}일 남음`;
}

export function UpcomingDeadlines({ logs }: { logs: WorkLog[] }) {
  const upcoming = logs
    .filter((log) => log.status === "예정" && log.date)
    .map((log) => ({ ...log, daysUntil: getDaysUntil(log.date) }))
    .filter((log) => log.daysUntil <= 3)
    .sort((a, b) => a.daysUntil - b.daysUntil);

  if (upcoming.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          마감 임박
          <Badge variant="destructive" className="ml-auto text-xs">
            {upcoming.length}건
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {upcoming.map((log) => (
            <Link
              key={log.id}
              href={`/logs/${log.id}`}
              className={`flex items-center gap-3 rounded-md border-l-4 p-2.5 transition-colors hover:opacity-80 ${getUrgencyStyle(log.daysUntil)}`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{log.title}</p>
                <p className="text-xs text-muted-foreground">{log.date}</p>
              </div>
              <Badge variant="secondary" className={`text-xs shrink-0 ${PROJECT_COLORS[log.project]}`}>
                {log.project}
              </Badge>
              <span className={`text-xs font-medium shrink-0 ${
                log.daysUntil <= 0 ? "text-red-600 dark:text-red-400" :
                log.daysUntil === 1 ? "text-orange-600 dark:text-orange-400" :
                "text-yellow-600 dark:text-yellow-400"
              }`}>
                {getUrgencyLabel(log.daysUntil)}
              </span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
