"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { STATUS_COLORS, PROJECT_COLORS } from "@/lib/constants";
import { CalendarCheck, CheckCircle2, Circle, Clock } from "lucide-react";
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
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <CalendarCheck className="h-4 w-4" />
          오늘의 업무
          {logs.length > 0 && (
            <Badge variant="secondary" className="ml-auto text-xs">
              {logs.length}건
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <p className="text-sm text-muted-foreground py-3 text-center">
            오늘 등록된 업무가 없습니다
          </p>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => {
              const Icon = STATUS_ICONS[log.status];
              return (
                <Link
                  key={log.id}
                  href={`/logs/${log.id}`}
                  className="flex items-center gap-3 rounded-md p-2 -mx-2 transition-colors hover:bg-muted/50"
                >
                  <Icon className={`h-4 w-4 shrink-0 ${
                    log.status === "완료" ? "text-green-500" :
                    log.status === "진행 중" ? "text-blue-500" : "text-muted-foreground"
                  }`} />
                  <span className="flex-1 text-sm truncate">{log.title}</span>
                  <Badge variant="secondary" className={`text-xs shrink-0 ${PROJECT_COLORS[log.project]}`}>
                    {log.project}
                  </Badge>
                  {log.hours !== null && (
                    <span className="text-xs text-muted-foreground shrink-0">{log.hours}h</span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
