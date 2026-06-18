import { generateObject } from "ai";
import { z } from "zod";
import { model } from "./ai";

const workLogSchema = z.object({
  entries: z.array(
    z.object({
      title: z.string().describe("업무 제목 (간결하게)"),
      date: z.string().describe("날짜 (YYYY-MM-DD 형식)"),
      project: z.enum(["업무", "개인일정"]).describe("프로젝트 분류"),
      status: z.enum(["예정", "진행 중", "완료"]).describe("진행 상태"),
      content: z.string().describe("업무 상세 내용"),
      tags: z
        .array(z.enum(["회의", "개발", "기획", "리뷰", "버그"]))
        .describe("관련 태그"),
      hours: z.number().nullable().describe("소요 시간 (시간 단위)"),
      link: z.string().nullable().describe("관련 링크 URL"),
    })
  ),
});

export async function parseMemoText(text: string, today: string) {
  const { object } = await generateObject({
    model,
    schema: workLogSchema,
    prompt: `당신은 업무일지 파싱 도우미입니다. 사용자가 자유롭게 작성한 메모를 구조화된 업무일지 항목으로 변환해주세요.

오늘 날짜: ${today}

규칙:
- 하나의 메모에서 여러 업무를 분리해서 각각 항목으로 만드세요
- 여러 날짜가 언급되면 날짜별로 각각 별도 항목을 만드세요 (예: "오늘 내일 연차" → 오늘 연차 1건 + 내일 연차 1건)
- 날짜 범위("월~금", "18일부터 20일까지", "3일간")는 각 날짜별로 별도 항목을 만드세요
- 날짜 언급이 없으면 오늘 날짜를 사용하세요
- "내일", "어제", "모레", "글피" 등 상대 날짜는 오늘 기준으로 계산하세요
- "이번 주 수요일", "다음 주 월요일", "지난주 금요일" 등 요일 기반 날짜도 오늘 기준으로 계산하세요
- "6월 20일", "6/20" 등 한국식 날짜 표현도 올해 기준으로 변환하세요
- 한 문장에 여러 업무가 있으면 각각 분리하세요 (예: "회의하고 코드 리뷰했어" → 회의 1건 + 코드 리뷰 1건)
- 프로젝트 분류: 개인적인 일/생활/취미/약속/연차/휴가/병가 → "개인일정", 그 외 회사/업무 관련 → "업무"
- 진행상태: "했다/완료/끝냄/마무리" → "완료", "할 예정/내일/계획/해야/할 거" → "예정", "하는 중/진행/작업 중" → "진행 중"
- 태그: 미팅/회의/통화/콜 → "회의", 코딩/개발/구현/배포 → "개발", 기획/설계/문서 → "기획", 리뷰/검토/피드백 → "리뷰", 버그/에러/수정/핫픽스 → "버그"
- 시간 언급이 있으면 hours에 넣고, 없으면 null (예: "2시간 회의" → hours: 2)
- 링크(URL)가 있으면 link에 넣고, 없으면 null
- content에는 원본 메모에서 해당 업무에 관련된 상세 내용을 넣으세요

사용자 메모:
${text}`,
  });

  return object.entries;
}
