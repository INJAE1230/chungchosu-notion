"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CheckCircle2,
  Smartphone,
  Share2,
  MoreVertical,
  Plus,
  Download,
  Layers,
} from "lucide-react";

type Platform = "ios" | "android" | "desktop" | "unknown";
type Tab = "ios" | "android";

function detectPlatform(): Platform {
  if (typeof window === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return "ios";
  if (/Android/.test(ua)) return "android";
  return "desktop";
}

function isInStandaloneMode(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as { standalone?: boolean }).standalone === true
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BeforeInstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

const IOS_STEPS = [
  {
    icon: "safari",
    title: "Safari에서 열기",
    desc: "Chrome이 아닌 Safari 브라우저에서 이 페이지를 열어주세요.",
    highlight: false,
  },
  {
    icon: "share",
    title: "공유 버튼 탭",
    desc: "화면 하단 가운데 또는 상단의 공유(⬆) 버튼을 탭하세요.",
    highlight: true,
  },
  {
    icon: "plus",
    title: "홈 화면에 추가",
    desc: "스크롤해서 '홈 화면에 추가'를 찾아 탭하세요.",
    highlight: true,
  },
  {
    icon: "check",
    title: "추가 완료",
    desc: "'추가' 버튼을 탭하면 홈 화면에 앱 아이콘이 생깁니다.",
    highlight: false,
  },
];

const ANDROID_STEPS = [
  {
    icon: "chrome",
    title: "Chrome에서 열기",
    desc: "Chrome 브라우저에서 이 페이지를 열어주세요.",
    highlight: false,
  },
  {
    icon: "menu",
    title: "메뉴 탭",
    desc: "우측 상단 ⋮ 아이콘을 탭하세요.",
    highlight: true,
  },
  {
    icon: "plus",
    title: "앱 설치 선택",
    desc: "'앱 설치' 또는 '홈 화면에 추가'를 탭하세요.",
    highlight: true,
  },
  {
    icon: "check",
    title: "설치 완료",
    desc: "'설치' 버튼을 탭하면 앱 아이콘이 생성됩니다.",
    highlight: false,
  },
];

function StepIcon({ icon }: { icon: string }) {
  switch (icon) {
    case "share":
      return <Share2 className="h-5 w-5" />;
    case "plus":
      return <Plus className="h-5 w-5" />;
    case "check":
      return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
    case "menu":
      return <MoreVertical className="h-5 w-5" />;
    default:
      return <Smartphone className="h-5 w-5" />;
  }
}

export default function InstallPage() {
  const [platform, setPlatform] = useState<Platform>("unknown");
  const [installed, setInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("ios");
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    const p = detectPlatform();
    setPlatform(p);
    setInstalled(isInStandaloneMode());
    setActiveTab(p === "android" ? "android" : "ios");

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleAndroidInstall = async () => {
    if (!deferredPrompt) return;
    setInstalling(true);
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") setInstalled(true);
      setDeferredPrompt(null);
    } finally {
      setInstalling(false);
    }
  };

  const steps = activeTab === "ios" ? IOS_STEPS : ANDROID_STEPS;
  const appUrl = typeof window !== "undefined" ? window.location.origin : "injae-notion.vercel.app";

  return (
    <div className="min-h-screen bg-background">
      {/* 상단 내비 */}
      <div className="flex items-center h-14 px-4 border-b">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            돌아가기
          </Button>
        </Link>
      </div>

      <div className="max-w-md mx-auto px-4 py-8 space-y-8">
        {/* 앱 소개 */}
        <div className="flex flex-col items-center text-center gap-4">
          <div className="relative">
            <div className="h-24 w-24 rounded-[22px] bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center shadow-xl shadow-violet-500/30">
              <Layers className="h-12 w-12 text-white" />
            </div>
            {installed && (
              <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center ring-2 ring-background">
                <CheckCircle2 className="h-3.5 w-3.5 text-white" />
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">업무일지</h1>
            <p className="text-sm text-muted-foreground mt-1">{appUrl}</p>
          </div>
          <div className="flex gap-2 text-xs text-muted-foreground">
            {["무료", "오프라인 지원", "광고 없음"].map((tag) => (
              <span key={tag} className="px-2.5 py-1 rounded-full bg-accent border">{tag}</span>
            ))}
          </div>
        </div>

        {/* 설치 상태 */}
        {installed ? (
          <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-5 text-center">
            <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
            <p className="font-semibold text-emerald-700 dark:text-emerald-400">이미 설치되어 있어요!</p>
            <p className="text-sm text-muted-foreground mt-1">홈 화면에서 앱 아이콘을 찾아보세요.</p>
          </div>
        ) : (
          <>
            {/* Android 직접 설치 버튼 */}
            {deferredPrompt && (
              <Button
                className="w-full h-12 rounded-xl text-base gap-2 bg-violet-600 hover:bg-violet-700 shadow-lg shadow-violet-500/30"
                onClick={handleAndroidInstall}
                disabled={installing}
              >
                <Download className="h-5 w-5" />
                {installing ? "설치 중..." : "앱 설치하기"}
              </Button>
            )}

            {/* 플랫폼 탭 */}
            <div>
              <div className="flex rounded-xl bg-accent p-1 mb-5">
                {(["ios", "android"] as Tab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground"
                    }`}
                  >
                    {tab === "ios" ? "🍎 iPhone / iPad" : "🤖 Android"}
                  </button>
                ))}
              </div>

              {/* 설치 단계 */}
              <div className="space-y-3">
                {steps.map((step, i) => (
                  <div
                    key={i}
                    className={`flex gap-4 rounded-2xl p-4 border transition-colors ${
                      step.highlight
                        ? "bg-violet-500/5 border-violet-500/20"
                        : "bg-card border-border"
                    }`}
                  >
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${
                        step.icon === "check"
                          ? "bg-emerald-500/10"
                          : step.highlight
                          ? "bg-violet-500/15 text-violet-600 dark:text-violet-400"
                          : "bg-accent text-muted-foreground"
                      }`}
                    >
                      {step.icon === "check" ? (
                        <StepIcon icon="check" />
                      ) : (
                        <span>{i + 1}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold">{step.title}</p>
                        <StepIcon icon={step.icon} />
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* 기능 소개 */}
        <div className="rounded-2xl border bg-card p-5 space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">앱 특징</h2>
          {[
            { emoji: "⚡", title: "빠른 업무 입력", desc: "AI가 자연어 메모를 자동 정리" },
            { emoji: "📊", title: "실시간 현황", desc: "업무 진행 상황을 한눈에 파악" },
            { emoji: "🗂️", title: "트랙 관리", desc: "장기 프로젝트 흐름을 별도 관리" },
            { emoji: "🌙", title: "다크/라이트 모드", desc: "상황에 맞게 테마 전환 가능" },
          ].map((feat) => (
            <div key={feat.title} className="flex items-start gap-3">
              <span className="text-xl">{feat.emoji}</span>
              <div>
                <p className="text-sm font-medium">{feat.title}</p>
                <p className="text-xs text-muted-foreground">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
