import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "업무일지 대시보드",
    short_name: "업무일지",
    description: "노션 기반 업무일지 관리 시스템",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#8b5cf6",
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
