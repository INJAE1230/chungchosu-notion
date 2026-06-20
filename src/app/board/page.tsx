import { getAllWorkLogs } from "@/lib/notion-service";
import { KanbanBoard } from "@/components/board/kanban-board";

export const dynamic = "force-dynamic";

export default async function BoardPage() {
  const allLogs = await getAllWorkLogs();
  return <KanbanBoard initialLogs={allLogs} />;
}
