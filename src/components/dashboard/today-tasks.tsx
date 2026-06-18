"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PROJECT_COLORS } from "@/lib/constants";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import type { WorkLog } from "@/lib/types";

const STATUS_ICONS = {
  "완료": CheckCircle2,
  "진행 중": Clock,
  "예정": Circle,
} as const;

export function TodayTasks({ logs }: { logs: WorkLog[] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">오늘의 업무</CardTitle>
          {logs.length > 0 && (
            <span className="text-xs text-muted-foreground">{logs.length}건</span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            오늘 등록된 업무가 없습니다
          </p>
        ) : (
          <div className="space-y-1">
            {logs.map((log) => {
              const Icon = STATUS_ICONS[log.status];
              return (
                <Link
                  key={log.id}
                  href={`/logs/${log.id}`}
                  className="flex items-center gap-3 rounded-lg px-2.5 py-2 -mx-2.5 transition-colors hover:bg-accent/50"
                >
                  <Icon className={`h-3.5 w-3.5 shrink-0 ${
                    log.status === "완료" ? "text-emerald-500" :
                    log.status === "진행 중" ? "text-blue-500" : "text-muted-foreground/50"
                  }`} />
                  <span className={`flex-1 text-sm truncate ${
                    log.status === "완료" ? "line-through text-muted-foreground" : ""
                  }`}>
                    {log.title}
                  </span>
                  <Badge variant="secondary" className={`text-[11px] shrink-0 ${PROJECT_COLORS[log.project]}`}>
                    {log.project}
                  </Badge>
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
