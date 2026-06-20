"use client";

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PROJECTS } from "@/lib/constants";
import type { DashboardStats } from "@/lib/types";

const CHART_COLORS: Record<string, string> = {
  "청초수": "#3b82f6",
  "씨푸드": "#06b6d4",
  "JS코퍼": "#8b5cf6",
  "JKK": "#6366f1",
  "646코퍼": "#f59e0b",
  "아일랜드": "#22c55e",
  "청초수(신관)": "#0ea5e9",
  "에이전트": "#f43f5e",
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
    .filter((d) => d.count > 0);

  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">사업장별 분포</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barCategoryGap="20%">
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
                }}
              />
              <Bar
                dataKey="count"
                name="업무 수"
                radius={[6, 6, 0, 0]}
                animationDuration={800}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
