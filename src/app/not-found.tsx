import Link from "next/link";
import { Compass, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent">
        <Compass className="h-7 w-7 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">페이지를 찾을 수 없어요</h2>
        <p className="text-sm text-muted-foreground">
          요청하신 페이지가 없거나 이동되었습니다.
        </p>
      </div>
      <Button asChild className="gap-2">
        <Link href="/">
          <Home className="h-4 w-4" />
          대시보드로 이동
        </Link>
      </Button>
    </div>
  );
}
