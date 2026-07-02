"use client";

// 루트 레이아웃 자체가 실패한 경우의 최후 방어선. 자체 html/body를 렌더링하며,
// 레이아웃 밖에서 동작하므로 안전하게 인라인 스타일만 사용한다.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ko">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          fontFamily: "system-ui, sans-serif",
          background: "#111",
          color: "#eee",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <h2 style={{ fontSize: "18px", fontWeight: 600 }}>
          문제가 발생했어요
        </h2>
        <p style={{ fontSize: "14px", color: "#aaa", margin: 0 }}>
          앱을 불러오지 못했습니다. 다시 시도해 주세요.
        </p>
        <button
          onClick={reset}
          style={{
            marginTop: "8px",
            padding: "8px 16px",
            borderRadius: "8px",
            border: "none",
            background: "#6366f1",
            color: "#fff",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          다시 시도
        </button>
      </body>
    </html>
  );
}
