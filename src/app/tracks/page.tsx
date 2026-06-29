import { getAllTracks } from "@/lib/track-service";
import { getAllWorkLogs } from "@/lib/notion-service";
import { TrackBoard } from "@/components/tracks/track-board";

export const dynamic = "force-dynamic";

export default async function TracksPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const [tracks, allLogs] = await Promise.all([getAllTracks(), getAllWorkLogs()]);
  return <TrackBoard tracks={tracks} allLogs={allLogs} initialTrackId={params.track} />;
}
