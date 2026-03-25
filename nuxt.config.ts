import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { networkInterfaces } from "node:os";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

function getLocalIP(): string {
  // 优先匹配常见局域网段，避免 docker 网桥、VPN 等虚拟网卡干扰
  const lanPatterns = [/^192\.168\./, /^10\./, /^172\.(1[6-9]|2\d|3[01])\./];
  const candidates: string[] = [];

  for (const nets of Object.values(networkInterfaces())) {
    for (const net of nets ?? []) {
      if (net.family === "IPv4" && !net.internal) candidates.push(net.address);
    }
  }

  for (const pattern of lanPatterns) {
    const match = candidates.find((ip) => pattern.test(ip));
    if (match) return match;
  }

  return candidates[0] ?? "localhost";
}

const isDev = process.env.NODE_ENV !== "production";

const SITE_TITLE = "UselessBamboo";
const SITE_DESCRIPTION = "一个记录和总结日常学习和工作中的技术点滴的Knowledge Repository.";

export default defineNuxtConfig({
  devtools: { enabled: false },

  devServer: {
    host: "0.0.0.0",
  },

  vite: {
    server: isDev
      ? {
          hmr: { host: process.env.NUXT_HMR_HOST ?? getLocalIP() },
        }
      : {},
  },

  modules: [
    "@nuxt/content",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "@nuxt/icon",
  ],

  icon: {
    serverBundle: {
      collections: ["ph"],
    },
  },

  content: {
    watch: {
      ws: {
        hostname: process.env.NUXT_HMR_HOST ?? getLocalIP(),
      },
    },
    // 直接读取 blog/_posts 目录（blog 是指向内容仓库的符号链接）
    sources: {
      content: {
        driver: "fs",
        base: resolve(__dirname, "blog/_posts"),
      },
    },
    highlight: {
      theme: {
        default: "vitesse-light",
        dark: "vitesse-dark",
      },
      langs: [
        "bash",
        "shell",
        "sh",
        "python",
        "javascript",
        "typescript",
        "vue",
        "html",
        "css",
        "json",
        "yaml",
        "sql",
        "go",
        "rust",
        "java",
        "c",
        "cpp",
        "markdown",
        "dockerfile",
        "nginx",
        "ini",
        "toml",
        "xml",
        "powershell",
        "lua",
        "vim",
        "http",
      ],
    },
  },

  colorMode: {
    classSuffix: "",
    preference: "system",
    fallback: "light",
    storageKey: "blog-color-mode",
  },

  appConfig: {
    siteName: "旧迹微光，向远而行",
    siteTitle: SITE_TITLE,
    siteDescription: SITE_DESCRIPTION,
  },

  app: {
    head: {
      title: SITE_TITLE,
      htmlAttrs: { lang: "zh-CN" },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "description", content: SITE_DESCRIPTION },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },

  css: ["~/assets/css/main.css"],

  compatibilityDate: "2024-11-01",
});
