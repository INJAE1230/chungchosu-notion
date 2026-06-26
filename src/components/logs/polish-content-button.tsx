"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { toastError } from "@/lib/toast-utils";

export function PolishContentButton({ logId, hasContent }: { logId: string; hasContent: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!hasContent) return null;

  const handlePolish = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/logs/${logId}/polish`, { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "다듬기 실패");
      }
      toast.success("업무내용이 다듬어졌습니다");
      router.refresh();
    } catch (error) {
      toastError(error instanceof Error ? error.message : "다듬기에 실패했습니다", handlePolish);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-6 text-xs text-muted-foreground hover:text-primary"
      onClick={handlePolish}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
      ) : (
        <Sparkles className="mr-1 h-3 w-3" />
      )}
      {loading ? "다듬는 중..." : "AI 다듬기"}
    </Button>
  );
}
