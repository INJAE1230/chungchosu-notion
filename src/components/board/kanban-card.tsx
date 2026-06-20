"use client";

import { useDraggable } from "@dnd-kit/core";
import { Badge } from "@/components/ui/badge";
import { PROJECT_COLORS, PRIORITY_COLORS } from "@/lib/constants";
import type { WorkLog } from "@/lib/types";

interface KanbanCardProps {
  log: WorkLog;
}

export function KanbanCard({ log }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: log.id, data: { log } });

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`rounded-lg border bg-card p-3 shadow-sm cursor-grab active:cursor-grabbing transition-shadow ${
        isDragging ? "opacity-50 shadow-lg ring-2 ring-primary/30" : "hover:shadow-md"
      }`}
    >
      <p className="text-sm font-medium truncate">{log.title}</p>
      <div className="flex flex-wrap items-center gap-1 mt-1.5">
        <Badge variant="secondary" className={`text-[10px] ${PROJECT_COLORS[log.project]}`}>
          {log.project}
        </Badge>
        {log.priority && (
          <Badge variant="secondary" className={`text-[10px] ${PRIORITY_COLORS[log.priority]}`}>
            {log.priority}
          </Badge>
        )}
      </div>
      {log.date && (
        <p className="text-[11px] text-muted-foreground mt-1.5">{log.date}</p>
      )}
    </div>
  );
}
