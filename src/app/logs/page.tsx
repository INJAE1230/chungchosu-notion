import { Suspense } from "react";
import Link from "next/link";
import { queryWorkLogs } from "@/lib/notion-service";
import { LogTable } from "@/components/logs/log-table";
import { LogFilters } from "@/components/logs/log-filters";
import { CsvDownload } from "@/components/logs/csv-download";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import type { WorkLogFilters, WorkLog } from "@/lib/types";

export const dynamic = "force-dynamic";

async function LogList({ searchParams }: { searchParams: Record<string, string> }) {
  const filters: WorkLogFilters = {};
  if (searchParams.dateFrom) filters.dateFrom = searchParams.dateFrom;
  if (searchParams.dateTo) filters.dateTo = searchParams.dateTo;
  if (searchParams.project) filters.project = searchParams.project as WorkLogFilters["project"];
  if (searchParams.status) filters.status = searchParams.status as WorkLogFilters["status"];
  if (searchParams.tags) filters.tags = searchParams.tags.split(",") as WorkLogFilters["tags"];
  if (searchParams.search) filters.search = searchParams.search;

  const logs = await queryWorkLogs(
    Object.keys(filters).length > 0 ? filters : undefined
  );

  return (
    <>
      <CsvDownload logs={logs} />
      <LogTable logs={logs} />
    </>
  );
}

export default async function LogsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">업무 목록</h1>
        <Link href="/logs/new">
          <Button size="sm">
            <Plus className="mr-1 h-3.5 w-3.5" />
            업무 추가
          </Button>
        </Link>
      </div>

      <Suspense fallback={null}>
        <LogFilters />
      </Suspense>

      <Suspense
        fallback={
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-11 w-full rounded-lg" />
            ))}
          </div>
        }
      >
        <LogList searchParams={params} />
      </Suspense>
    </div>
  );
}
