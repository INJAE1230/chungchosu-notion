import { getAllWorkLogs } from "@/lib/notion-service";
import { CalendarView } from "@/components/calendar/calendar-view";
import { GoogleCalendarEmbed } from "@/components/calendar/google-calendar-embed";
import { Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const logs = await getAllWorkLogs();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Calendar className="h-6 w-6 text-sky-500" />
          캘린더
        </h1>
        <p className="text-sm text-muted-foreground">업무 일정과 Google Calendar를 한눈에</p>
      </div>
      <CalendarView logs={logs} />
      <GoogleCalendarEmbed />
    </div>
  );
}
