"use client";

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PROJECTS } from "@/lib/constants";
import type { DashboardStats } from "@/lib/types";

const CHART_COLORS: Record<string, string> = {
  "청초수": "#3b82f6",
  "씨푸드": "#06b6d4",
  "JS코퍼": "#8b5cf6",
  "JKK": "#6366f1",
  "646미터퍼세크": "#f59e0b",
  "아일랜드": "#22c55e",
  "청초수(신관)": "#0ea5e9",
  "에그롤린대전": "#f97316",
  "개인일정": "#94a3b8",
};

export function ProjectChart({ stats }: { stats: DashboardStats }) {
  const data = PROJECTS
    .map((name) => ({
      name,
      count: stats.byProject[name] || 0,
      fill: CHART_COLORS[name] || "#94a3b8",
    }))
    .filter((d) => d.count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">사업장별 분포</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[220px] flex-col items-center justify-center gap-2 text-muted-foreground">
            <BarChart3 className="h-10 w-10 text-muted-foreground/30" />
            <p className="text-sm">데이터가 없습니다</p>
          </div>
        ) : (
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} barCategoryGap="25%" margin={{ bottom: 5 }}>
                <defs>
                  {data.map((entry, i) => (
                    <linearGradient key={i} id={`projGrad-${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={entry.fill} stopOpacity={1} />
                      <stop offset="100%" stopColor={entry.fill} stopOpacity={0.5} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--border)"
                />
                <XAxis
                  dataKey="name"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  height={50}
                />
                <YAxis
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
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
                  dataKey="count"
                  name="업무 수"
                  radius={[6, 6, 0, 0]}
                  animationDuration={800}
                >
                  {data.map((_, i) => (
                    <Cell key={i} fill={`url(#projGrad-${i})`} />
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
