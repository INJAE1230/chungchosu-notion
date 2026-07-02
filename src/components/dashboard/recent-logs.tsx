"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ClipboardList } from "lucide-react";
import { STATUS_COLORS, PROJECT_COLORS } from "@/lib/constants";
import { EmptyState } from "@/components/ui/empty-state";
import type { WorkLog } from "@/lib/types";

export function RecentLogs({ logs }: { logs: WorkLog[] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">최근 업무</CardTitle>
          <Link
            href="/logs"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            전체 보기
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="아직 등록된 업무가 없어요"
            description="첫 업무를 추가하고 기록을 시작해보세요"
            action={{ label: "첫 업무 추가", href: "/logs/new" }}
          />
        ) : (
          <div className="space-y-1">
            {logs.map((log) => (
              <Link
                key={log.id}
                href={`/logs/${log.id}`}
                className="flex items-center gap-3 rounded-lg px-2.5 py-2.5 -mx-2.5 transition-colors hover:bg-accent/50"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{log.title}</p>
                  <p className="text-[11px] text-muted-foreground">{log.date}</p>
                </div>
                {log.projects.map((proj) => (
                  <Badge key={proj} variant="secondary" className={`text-[11px] shrink-0 ${PROJECT_COLORS[proj]}`}>
                    {proj}
                  </Badge>
                ))}
                <Badge variant="secondary" className={`text-[11px] shrink-0 ${STATUS_COLORS[log.status]}`}>
                  {log.status}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
