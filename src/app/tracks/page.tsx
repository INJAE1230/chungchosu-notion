import { getAllTracks } from "@/lib/track-service";
import { getAllWorkLogs } from "@/lib/notion-service";
import { TrackBoard } from "@/components/tracks/track-board";

export const dynamic = "force-dynamic";

export default async function TracksPage() {
  const [tracks, allLogs] = await Promise.all([getAllTracks(), getAllWorkLogs()]);
  return <TrackBoard tracks={tracks} allLogs={allLogs} />;
}
