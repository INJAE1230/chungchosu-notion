"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  ArrowLeft,
  CheckCircle2,
  Clock,
  TrendingUp,
  CalendarDays,
} from "lucide-react";
import { PROJECT_COLORS } from "@/lib/constants";
import { STATUS_COLORS } from "@/lib/constants";
import type { EntityStats } from "@/lib/stats";
import type { WorkLog } from "@/lib/types";

interface EntityGridProps {
  entityStats: EntityStats[];
  allLogs: WorkLog[];
}

const ENTITY_COLORS: Record<string, string> = {
  "청초수": "#3b82f6",
  "청초수씨푸드": "#06b6d4",
  "646미터퍼세크": "#f59e0b",
  "아일랜드프로젝트646미터퍼세크": "#22c55e",
  "JS코퍼레이션": "#8b5cf6",
  "JKK인터내셔널": "#6366f1",
  "에그롤린대전": "#f97316",
  "바비캐럿": "#ec4899",
  "이니셜뮤직코리아": "#14b8a6",
};

export function EntityGrid({ entityStats, allLogs }: EntityGridProps) {
  const [selected, setSelected] = useState<EntityStats | null>(null);

  if (selected) {
    const entityLogs = allLogs.filter((log) =>
      log.projects.some((p) => selected.projects.includes(p))
    );

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Building2 className="h-6 w-6 text-violet-500" />
            법인 통합 뷰
          </h1>
          <p className="text-sm text-muted-foreground">법인별 업무 현황을 한눈에 확인하세요</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="gap-1" onClick={() => setSelected(null)}>
            <ArrowLeft className="h-4 w-4" /> 전체 법인
          </Button>
          <h2 className="text-lg font-semibold">{selected.entity}</h2>
          <div className="flex gap-1">
            {selected.projects.map((p) => (
              <Badge key={p} variant="secondary" className={`text-[10px] ${PROJECT_COLORS[p]}`}>
                {p}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Card className="border-0 bg-accent/40">
            <CardContent className="px-4 py-3.5">
              <p className="text-xs text-muted-foreground">전체 업무</p>
              <span className="text-2xl font-semibold">{selected.totalLogs}</span>
              <span className="text-xs text-muted-foreground ml-1">건</span>
            </CardContent>
          </Card>
          <Card className="border-0 bg-accent/40">
            <CardContent className="px-4 py-3.5">
              <p className="text-xs text-muted-foreground">완료율</p>
              <span className="text-2xl font-semibold">{selected.completionRate}</span>
              <span className="text-xs text-muted-foreground ml-1">%</span>
            </CardContent>
          </Card>
          <Card className="border-0 bg-accent/40">
            <CardContent className="px-4 py-3.5">
              <p className="text-xs text-muted-foreground">진행 중</p>
              <span className="text-2xl font-semibold">{selected.inProgressLogs}</span>
              <span className="text-xs text-muted-foreground ml-1">건</span>
            </CardContent>
          </Card>
          <Card className="border-0 bg-accent/40">
            <CardContent className="px-4 py-3.5">
              <p className="text-xs text-muted-foreground">이번 달</p>
              <span className="text-2xl font-semibold">{selected.thisMonthLogs}</span>
              <span className="text-xs text-muted-foreground ml-1">건</span>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-0">
            {entityLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">업무가 없습니다</p>
            ) : (
              <div className="divide-y">
                {entityLogs.slice(0, 50).map((log) => (
                  <div key={log.id} className="flex items-center gap-3 px-4 py-2.5">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{log.title}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[11px] text-muted-foreground">
                          {log.date} ({["일","월","화","수","목","금","토"][new Date(log.date + "T00:00:00").getDay()]})
                        </span>
                        {log.projects.map((p) => (
                          <Badge key={p} variant="secondary" className={`text-[10px] ${PROJECT_COLORS[p]}`}>
                            {p}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Badge variant="secondary" className={`text-[10px] shrink-0 ${STATUS_COLORS[log.status]}`}>
                      {log.status}
                    </Badge>
                  </div>
                ))}
                {entityLogs.length > 50 && (
                  <p className="text-xs text-muted-foreground py-3 text-center">
                    외 {entityLogs.length - 50}건
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Building2 className="h-6 w-6 text-violet-500" />
          법인 통합 뷰
        </h1>
        <p className="text-sm text-muted-foreground">법인별 업무 현황을 한눈에 확인하세요</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {entityStats.map((es) => {
          const color = ENTITY_COLORS[es.entity] || "#94a3b8";
          const hasData = es.totalLogs > 0;
          return (
            <Card
              key={es.entity}
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.01] border-l-4"
              style={{ borderLeftColor: color }}
              onClick={() => setSelected(es)}
            >
              <CardContent className="px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold">{es.entity}</h3>
                  <div className="flex gap-1">
                    {es.projects.map((p) => (
                      <Badge key={p} variant="secondary" className={`text-[9px] ${PROJECT_COLORS[p]}`}>
                        {p}
                      </Badge>
                    ))}
                  </div>
                </div>

                {hasData ? (
                  <>
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-muted-foreground mb-0.5">
                          <CalendarDays className="h-3 w-3" />
                          <span className="text-[10px]">이번 달</span>
                        </div>
                        <p className="text-lg font-bold">{es.thisMonthLogs}</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-muted-foreground mb-0.5">
                          <TrendingUp className="h-3 w-3" />
                          <span className="text-[10px]">완료율</span>
                        </div>
                        <p className="text-lg font-bold">{es.completionRate}%</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-muted-foreground mb-0.5">
                          <Clock className="h-3 w-3" />
                          <span className="text-[10px]">진행 중</span>
                        </div>
                        <p className="text-lg font-bold">{es.inProgressLogs}</p>
                      </div>
                    </div>

                    <div className="h-1.5 rounded-full bg-accent overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${es.completionRate}%`, backgroundColor: color }}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1 text-right">
                      전체 {es.totalLogs}건 · {es.totalHours}h
                    </p>
                  </>
                ) : (
                  <div className="flex items-center justify-center py-4 text-muted-foreground">
                    <p className="text-xs">업무 데이터 없음</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
