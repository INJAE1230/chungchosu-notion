"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExternalLink } from "lucide-react";
import { PROJECTS, PROJECT_COLORS, TAG_COLORS } from "@/lib/constants";
import type { WorkLog, Project, AchievementRating } from "@/lib/types";

const RATING_COLORS: Record<string, string> = {
  "상": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  "중": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "하": "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
};

export function AchievementList({ achievements }: { achievements: WorkLog[] }) {
  const [filterProject, setFilterProject] = useState<Project | "all">("all");
  const [filterRating, setFilterRating] = useState<AchievementRating | "all">("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filtered = useMemo(() => {
    let result = achievements;
    if (filterProject !== "all") {
      result = result.filter((l) => l.projects.includes(filterProject));
    }
    if (filterRating !== "all") {
      result = result.filter((l) => l.rating === filterRating);
    }
    if (dateFrom) {
      result = result.filter((l) => l.date >= dateFrom);
    }
    if (dateTo) {
      result = result.filter((l) => l.date <= dateTo);
    }
    return result;
  }, [achievements, filterProject, filterRating, dateFrom, dateTo]);

  const hasFilters = filterProject !== "all" || filterRating !== "all" || dateFrom || dateTo;

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <Select value={filterProject} onValueChange={(v) => setFilterProject(v as Project | "all")}>
          <SelectTrigger className="w-[130px] h-9">
            <SelectValue placeholder="사업장" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 사업장</SelectItem>
            {PROJECTS.map((p) => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterRating} onValueChange={(v) => setFilterRating(v as AchievementRating | "all")}>
          <SelectTrigger className="w-[110px] h-9">
            <SelectValue placeholder="등급" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 등급</SelectItem>
            <SelectItem value="상">상</SelectItem>
            <SelectItem value="중">중</SelectItem>
            <SelectItem value="하">하</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="date"
          className="w-[140px] h-9"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
        />
        <span className="text-sm text-muted-foreground hidden sm:inline">~</span>
        <Input
          type="date"
          className="w-[140px] h-9"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
        />
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={() => { setFilterProject("all"); setFilterRating("all"); setDateFrom(""); setDateTo(""); }}>
            초기화
          </Button>
        )}
      </div>

      <p className="text-sm text-muted-foreground">{filtered.length}건의 성과</p>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              {hasFilters ? "조건에 맞는 성과가 없습니다." : "아직 성과 기록이 없습니다."}
            </p>
            {!hasFilters && (
              <p className="text-sm text-muted-foreground mt-1">
                업무를 완료하고 성과를 기록해보세요.
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((log) => (
            <Card key={log.id} className="hover:border-amber-300 transition-colors">
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/logs/${log.id}`}
                        className="font-medium hover:text-amber-600 transition-colors"
                      >
                        {log.title}
                      </Link>
                      {log.rating && (
                        <Badge variant="secondary" className={RATING_COLORS[log.rating]}>
                          {log.rating}
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5 text-xs">
                      <span className="text-muted-foreground">{log.date}</span>
                      {log.projects.map((proj) => (
                        <Badge key={proj} variant="secondary" className={`text-xs ${PROJECT_COLORS[proj]}`}>
                          {proj}
                        </Badge>
                      ))}
                      {log.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className={`text-xs ${TAG_COLORS[tag]}`}>
                          {tag}
                        </Badge>
                      ))}
                      {log.hours && (
                        <span className="text-muted-foreground">{log.hours}시간</span>
                      )}
                    </div>
                    {log.outcome && (
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {log.outcome}
                      </p>
                    )}
                  </div>
                  <Link href={`/logs/${log.id}`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
