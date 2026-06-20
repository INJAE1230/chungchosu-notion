"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { DashboardStats } from "@/lib/types";

export function SummaryCards({ stats }: { stats: DashboardStats }) {
  const completionRate =
    stats.totalLogs > 0
      ? Math.round((stats.byStatus["완료"] / stats.totalLogs) * 100)
      : 0;

  const cards = [
    { title: "총 업무", value: stats.totalLogs, unit: "건" },
    { title: "다음행동", value: stats.byStatus["다음행동"] || 0, unit: "건" },
    { title: "진행 중", value: stats.byStatus["진행 중"] || 0, unit: "건" },
    { title: "완료율", value: completionRate, unit: "%" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="border-0 bg-accent/40">
          <CardContent className="px-4 py-3.5">
            <p className="text-xs text-muted-foreground">{card.title}</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-semibold tracking-tight">
                {card.value}
              </span>
              <span className="text-xs text-muted-foreground">{card.unit}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
