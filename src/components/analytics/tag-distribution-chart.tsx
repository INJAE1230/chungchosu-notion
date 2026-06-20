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

const TAG_CHART_COLORS: Record<string, string> = {
  "회의": "#f59e0b",
  "개발": "#3b82f6",
  "기획": "#22c55e",
  "리뷰": "#8b5cf6",
  "버그": "#ef4444",
  "디자인": "#ec4899",
  "문서": "#06b6d4",
  "배포": "#14b8a6",
  "테스트": "#f97316",
  "운영": "#6366f1",
  "교육": "#a855f7",
  "연구": "#84cc16",
  "고객": "#e11d48",
  "인사": "#0ea5e9",
  "재무": "#d946ef",
};

export function TagDistributionChart({
  data,
}: {
  data: { tag: string; count: number; hours: number }[];
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">태그별 업무 분포</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barCategoryGap="25%">
              <XAxis dataKey="tag" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                formatter={(val, name) => {
                  if (name === "count") return [`${val}건`, "업무 수"];
                  return [val, name];
                }}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  background: "var(--background)",
                }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} animationDuration={800}>
                {data.map((entry) => (
                  <Cell key={entry.tag} fill={TAG_CHART_COLORS[entry.tag] || "#94a3b8"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
