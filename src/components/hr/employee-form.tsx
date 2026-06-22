"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { ENTITIES } from "@/lib/constants";
import { POSITIONS, EMPLOYMENT_STATUSES } from "@/lib/hr-types";
import type { EmployeeFormData } from "@/lib/hr-types";
import type { Entity } from "@/lib/constants";

interface EmployeeFormProps {
  initial?: Partial<EmployeeFormData>;
  onSubmit: (data: EmployeeFormData) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export function EmployeeForm({ initial, onSubmit, onCancel, submitLabel = "등록" }: EmployeeFormProps) {
  const [form, setForm] = useState<EmployeeFormData>({
    name: initial?.name || "",
    entity: initial?.entity || null,
    department: initial?.department || "",
    position: initial?.position || null,
    joinDate: initial?.joinDate || new Date().toISOString().slice(0, 10),
    status: initial?.status || "재직",
    annualLeaveTotal: initial?.annualLeaveTotal ?? 15,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setLoading(true);
    try {
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-xs font-medium">이름 *</label>
        <Input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="직원 이름"
          required
        />
      </div>

      <div>
        <label className="text-xs font-medium">법인</label>
        <select
          className="w-full h-9 rounded-md border bg-background px-3 text-sm"
          value={form.entity || ""}
          onChange={(e) => setForm({ ...form, entity: (e.target.value || null) as Entity | null })}
        >
          <option value="">선택 안함</option>
          {ENTITIES.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium">부서</label>
          <Input
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            placeholder="부서명"
          />
        </div>
        <div>
          <label className="text-xs font-medium">직급</label>
          <select
            className="w-full h-9 rounded-md border bg-background px-3 text-sm"
            value={form.position || ""}
            onChange={(e) => setForm({ ...form, position: (e.target.value || null) as EmployeeFormData["position"] })}
          >
            <option value="">선택 안함</option>
            {POSITIONS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium">재직상태</label>
          <select
            className="w-full h-9 rounded-md border bg-background px-3 text-sm"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as EmployeeFormData["status"] })}
          >
            {EMPLOYMENT_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium">입사일</label>
          <Input
            type="date"
            value={form.joinDate}
            onChange={(e) => setForm({ ...form, joinDate: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium">연차발생일수</label>
        <Input
          type="number"
          min={0}
          step={0.5}
          value={form.annualLeaveTotal}
          onChange={(e) => setForm({ ...form, annualLeaveTotal: parseFloat(e.target.value) || 0 })}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          취소
        </Button>
        <Button type="submit" size="sm" disabled={loading || !form.name.trim()}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : submitLabel}
        </Button>
      </div>
    </form>
  );
}
