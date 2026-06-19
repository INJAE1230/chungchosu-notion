import { getAllTemplates } from "@/lib/template-service";
import { templateDatabaseId } from "@/lib/notion";
import { TemplateTable } from "@/components/templates/template-table";
import { GenerateButtons } from "@/components/templates/generate-buttons";
import { TemplatePageHeader } from "@/components/templates/template-page-header";

export const dynamic = "force-dynamic";

export default async function TemplatesPage() {
  if (!templateDatabaseId) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold tracking-tight">반복 템플릿</h1>
        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          <p>NOTION_TEMPLATE_DATABASE_ID 환경변수를 설정해주세요.</p>
          <p className="mt-2 text-xs">
            Notion에서 템플릿용 데이터베이스를 만들고, 해당 ID를 .env.local에 추가하세요.
          </p>
        </div>
      </div>
    );
  }

  let templates;
  try {
    templates = await getAllTemplates();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold tracking-tight">반복 템플릿</h1>
        <div className="rounded-lg border border-destructive p-8 text-center text-sm text-muted-foreground">
          <p>템플릿 데이터를 불러오는 중 오류가 발생했습니다.</p>
          <p className="mt-2 text-xs text-destructive">{msg}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TemplatePageHeader />
      <GenerateButtons />
      <TemplateTable templates={templates} />
    </div>
  );
}
