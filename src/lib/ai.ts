import { createOpenAI } from "@ai-sdk/openai";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 기본 모델: 일반 파싱·요약 등 대부분의 호출에 사용 (저비용)
export const model = openai("gpt-4o-mini");

// 고성능 모델: 대용량 카톡 그룹 파싱처럼 긴 입력에서 디테일 보존이 중요한 호출에만 사용
export const modelPro = openai("gpt-4o");
