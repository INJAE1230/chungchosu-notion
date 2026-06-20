import { getAllWorkLogs } from "@/lib/notion-service";
import { WeeklyReview } from "@/components/review/weekly-review";

export const dynamic = "force-dynamic";

export default async function ReviewPage() {
  const allLogs = await getAllWorkLogs();
  return <WeeklyReview allLogs={allLogs} />;
}
