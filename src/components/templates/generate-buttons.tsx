"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CalendarDays, CalendarRange } from "lucide-react";

export function GenerateButtons() {
  const router = useRouter();
  const [loadingWeek, setLoadingWeek] = useState(false);
  const [loadingMonth, setLoadingMonth] = useState(false);

  const handleGenerate = async (mode: "이번주" | "이번달") => {
    const setLoading = mode === "이번주" ? setLoadingWeek : setLoadingMonth;
    setLoading(true);
    try {
      const res = await fetch("/api/templates/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.generated === 0) {
        toast.info(
          mode === "이번주"
            ? "생성할 주간 템플릿이 없습니다"
            : "생성할 월간 템플릿이 없습니다"
        );
      } else {
        toast.success(`${data.generated}건의 업무가 생성되었습니다`);
      }
      router.refresh();
    } catch {
      toast.error("업무 생성에 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="outline"
        onClick={() => handleGenerate("이번주")}
        disabled={loadingWeek || loadingMonth}
      >
        <CalendarDays className="mr-2 h-4 w-4" />
        {loadingWeek ? "생성 중..." : "이번 주 업무 생성"}
      </Button>
      <Button
        variant="outline"
        onClick={() => handleGenerate("이번달")}
        disabled={loadingWeek || loadingMonth}
      >
        <CalendarRange className="mr-2 h-4 w-4" />
        {loadingMonth ? "생성 중..." : "이번 달 업무 생성"}
      </Button>
    </div>
  );
}
