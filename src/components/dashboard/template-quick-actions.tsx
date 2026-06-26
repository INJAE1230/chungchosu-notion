"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { toastError } from "@/lib/toast-utils";
import { CalendarDays, CalendarRange, Settings } from "lucide-react";

export function TemplateQuickActions() {
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
      toastError("업무 생성에 실패했습니다", () => handleGenerate(mode));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium">반복 업무</h3>
        <Link href="/templates">
          <Button variant="ghost" size="icon" className="h-10 w-10 md:h-8 md:w-8">
            <Settings className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleGenerate("이번주")}
          disabled={loadingWeek || loadingMonth}
        >
          <CalendarDays className="mr-1.5 h-3.5 w-3.5" />
          {loadingWeek ? "생성 중..." : "이번 주 업무 생성"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleGenerate("이번달")}
          disabled={loadingWeek || loadingMonth}
        >
          <CalendarRange className="mr-1.5 h-3.5 w-3.5" />
          {loadingMonth ? "생성 중..." : "이번 달 업무 생성"}
        </Button>
      </div>
    </Card>
  );
}
