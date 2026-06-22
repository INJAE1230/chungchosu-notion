"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
  CartesianGrid,
} from "recharts";
import { Signal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardStats } from "@/lib/types";

const PRIORITY_DATA = [
  { key: "긴급+중요" as const, label: "긴급+중요", color: "#ef4444" },
  { key: "중요" as const, label: "중요", color: "#f97316" },
  { key: "긴급" as const, label: "긴급", color: "#eab308" },
  { key: "낮음" as const, label: "낮음", color: "#9ca3af" },
];

export function PriorityChart({ stats }: { stats: DashboardStats }) {
  const data = PRIORITY_DATA.map((p) => ({
    name: p.label,
    value: stats.byPriority[p.key] || 0,
    color: p.color,
  }));

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">우선순위 분포</CardTitle>
          {total > 0 && (
            <span className="text-xs text-muted-foreground">{total}건</span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <div className="flex h-[220px] flex-col items-center justify-center gap-2 text-muted-foreground">
            <Signal className="h-10 w-10 text-muted-foreground/30" />
            <p className="text-sm">우선순위가 설정된 업무가 없습니다</p>
          </div>
        ) : (
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
                <defs>
                  {data.map((entry, i) => (
                    <linearGradient key={i} id={`prioGrad-${i}`} x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                      <stop offset="100%" stopColor={entry.color} stopOpacity={0.5} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="var(--border)"
                />
                <XAxis
                  type="number"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={75}
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    background: "var(--background)",
                    fontSize: "12px",
                  }}
                  cursor={{ fill: "var(--accent)", opacity: 0.3 }}
                />
                <Bar
                  dataKey="value"
                  name="업무 수"
                  radius={[0, 6, 6, 0]}
                  barSize={24}
                  animationDuration={800}
                >
                  {data.map((_, i) => (
                    <Cell key={i} fill={`url(#prioGrad-${i})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
