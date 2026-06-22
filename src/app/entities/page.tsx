import { getAllWorkLogs } from "@/lib/notion-service";
import { getEntityStats } from "@/lib/stats";
import { EntityGrid } from "@/components/entities/entity-grid";

export const dynamic = "force-dynamic";

export default async function EntitiesPage() {
  const logs = await getAllWorkLogs();
  const entityStats = getEntityStats(logs);

  return <EntityGrid entityStats={entityStats} allLogs={logs} />;
}
