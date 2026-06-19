"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TemplateFormDialog } from "./template-form-dialog";

export function TemplatePageHeader() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">반복 템플릿</h1>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          템플릿 추가
        </Button>
      </div>

      <TemplateFormDialog
        open={showForm}
        onClose={() => setShowForm(false)}
      />
    </>
  );
}
