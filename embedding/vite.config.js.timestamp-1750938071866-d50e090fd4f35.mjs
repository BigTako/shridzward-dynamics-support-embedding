// vite.config.js
import { defineConfig } from "file:///C:/Users/User/Desktop/alex/work/keen-mcp/shridzward-support-embedding/embedding/node_modules/vite/dist/node/index.js";
import { fileURLToPath, URL } from "url";

// postcss.config.js
import tailwind from "file:///C:/Users/User/Desktop/alex/work/keen-mcp/shridzward-support-embedding/embedding/node_modules/tailwindcss/lib/index.js";
import autoprefixer from "file:///C:/Users/User/Desktop/alex/work/keen-mcp/shridzward-support-embedding/embedding/node_modules/autoprefixer/lib/autoprefixer.js";

// tailwind.config.js
var tailwind_config_default = {
  darkMode: "false",
  prefix: "allm-",
  corePlugins: {
    preflight: false
  },
  content: {
    relative: true,
    files: [
      "./src/components/**/*.{js,jsx}",
      "./src/hooks/**/*.js",
      "./src/models/**/*.js",
      "./src/pages/**/*.{js,jsx}",
      "./src/utils/**/*.js",
      "./src/*.jsx",
      "./index.html"
    ]
  },
  theme: {
    extend: {
      rotate: {
        "270": "270deg",
        "360": "360deg"
      },
      colors: {
        "black-900": "#141414",
        accent: "#3D4147",
        "sidebar-button": "#31353A",
        sidebar: "#25272C",
        "historical-msg-system": "rgba(255, 255, 255, 0.05);",
        "historical-msg-user": "#2C2F35",
        outline: "#4E5153",
        "primary-button": "#46C8FF",
        secondary: "#2C2F36",
        "dark-input": "#18181B",
        "mobile-onboarding": "#2C2F35",
        "dark-highlight": "#1C1E21",
        "dark-text": "#222628",
        description: "#D2D5DB",
        "x-button": "#9CA3AF"
      },
      backgroundImage: {
        "preference-gradient": "linear-gradient(180deg, #5A5C63 0%, rgba(90, 92, 99, 0.28) 100%);",
        "chat-msg-user-gradient": "linear-gradient(180deg, #3D4147 0%, #2C2F35 100%);",
        "selected-preference-gradient": "linear-gradient(180deg, #313236 0%, rgba(63.40, 64.90, 70.13, 0) 100%);",
        "main-gradient": "linear-gradient(180deg, #3D4147 0%, #2C2F35 100%)",
        "modal-gradient": "linear-gradient(180deg, #3D4147 0%, #2C2F35 100%)",
        "sidebar-gradient": "linear-gradient(90deg, #5B616A 0%, #3F434B 100%)",
        "login-gradient": "linear-gradient(180deg, #3D4147 0%, #2C2F35 100%)",
        "menu-item-gradient": "linear-gradient(90deg, #3D4147 0%, #2C2F35 100%)",
        "menu-item-selected-gradient": "linear-gradient(90deg, #5B616A 0%, #3F434B 100%)",
        "workspace-item-gradient": "linear-gradient(90deg, #3D4147 0%, #2C2F35 100%)",
        "workspace-item-selected-gradient": "linear-gradient(90deg, #5B616A 0%, #3F434B 100%)",
        "switch-selected": "linear-gradient(146deg, #5B616A 0%, #3F434B 100%)"
      },
      fontFamily: {
        sans: [
          "plus-jakarta-sans",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          '"Noto Sans"',
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"'
        ]
      },
      animation: {
        sweep: "sweep 0.5s ease-in-out"
      },
      keyframes: {
        sweep: {
          "0%": { transform: "scaleX(0)", transformOrigin: "bottom left" },
          "100%": { transform: "scaleX(1)", transformOrigin: "bottom left" }
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 }
        },
        fadeOut: {
          "0%": { opacity: 1 },
          "100%": { opacity: 0 }
        }
      }
    }
  },
  plugins: []
};

// postcss.config.js
var postcss_config_default = {
  plugins: [
    tailwind(tailwind_config_default),
    autoprefixer
  ]
};

// vite.config.js
import react from "file:///C:/Users/User/Desktop/alex/work/keen-mcp/shridzward-support-embedding/embedding/node_modules/@vitejs/plugin-react/dist/index.mjs";
import image from "file:///C:/Users/User/Desktop/alex/work/keen-mcp/shridzward-support-embedding/embedding/node_modules/@rollup/plugin-image/dist/es/index.js";
var __vite_injected_original_import_meta_url = "file:///C:/Users/User/Desktop/alex/work/keen-mcp/shridzward-support-embedding/embedding/vite.config.js";
var vite_config_default = defineConfig({
  plugins: [react(), image()],
  define: {
    // In dev, we need to disable this, but in prod, we need to enable it
    "process.env.NODE_ENV": JSON.stringify("production")
  },
  css: {
    postcss: postcss_config_default
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
      },
      {
        process: "process/browser",
        stream: "stream-browserify",
        zlib: "browserify-zlib",
        util: "util",
        find: /^~.+/,
        replacement: (val) => {
          return val.replace(/^~/, "");
        }
      }
    ]
  },
  build: {
    lib: {
      entry: "src/main.jsx",
      name: "EmbeddedAnythingLLM",
      formats: ["umd"],
      fileName: (_format) => `anythingllm-chat-widget.js`
    },
    rollupOptions: {
      external: [
        // Reduces transformation time by 50% and we don't even use this variant, so we can ignore.
        /@phosphor-icons\/react\/dist\/ssr/
      ]
    },
    commonjsOptions: {
      transformMixedEsModules: true
    },
    cssCodeSplit: false,
    assetsInlineLimit: 1e8,
    minify: "esbuild",
    outDir: "dist",
    emptyOutDir: true,
    inlineDynamicImports: true,
    assetsDir: "",
    sourcemap: "inline"
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis"
      },
      plugins: []
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiLCAicG9zdGNzcy5jb25maWcuanMiLCAidGFpbHdpbmQuY29uZmlnLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcVXNlclxcXFxEZXNrdG9wXFxcXGFsZXhcXFxcd29ya1xcXFxrZWVuLW1jcFxcXFxzaHJpZHp3YXJkLXN1cHBvcnQtZW1iZWRkaW5nXFxcXGVtYmVkZGluZ1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcVXNlclxcXFxEZXNrdG9wXFxcXGFsZXhcXFxcd29ya1xcXFxrZWVuLW1jcFxcXFxzaHJpZHp3YXJkLXN1cHBvcnQtZW1iZWRkaW5nXFxcXGVtYmVkZGluZ1xcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvVXNlci9EZXNrdG9wL2FsZXgvd29yay9rZWVuLW1jcC9zaHJpZHp3YXJkLXN1cHBvcnQtZW1iZWRkaW5nL2VtYmVkZGluZy92aXRlLmNvbmZpZy5qc1wiOy8vIHZpdGUuY29uZmlnLmpzXHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCJcclxuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSBcInVybFwiXHJcbmltcG9ydCBwb3N0Y3NzIGZyb20gXCIuL3Bvc3Rjc3MuY29uZmlnLmpzXCJcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiXHJcbmltcG9ydCBpbWFnZSBmcm9tIFwiQHJvbGx1cC9wbHVnaW4taW1hZ2VcIlxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbcmVhY3QoKSwgaW1hZ2UoKV0sXHJcbiAgZGVmaW5lOiB7XHJcbiAgICAvLyBJbiBkZXYsIHdlIG5lZWQgdG8gZGlzYWJsZSB0aGlzLCBidXQgaW4gcHJvZCwgd2UgbmVlZCB0byBlbmFibGUgaXRcclxuICAgIFwicHJvY2Vzcy5lbnYuTk9ERV9FTlZcIjogSlNPTi5zdHJpbmdpZnkoXCJwcm9kdWN0aW9uXCIpXHJcbiAgfSxcclxuICBjc3M6IHtcclxuICAgIHBvc3Rjc3NcclxuICB9LFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiBbXHJcbiAgICAgIHtcclxuICAgICAgICBmaW5kOiBcIkBcIixcclxuICAgICAgICByZXBsYWNlbWVudDogZmlsZVVSTFRvUGF0aChuZXcgVVJMKFwiLi9zcmNcIiwgaW1wb3J0Lm1ldGEudXJsKSlcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHByb2Nlc3M6IFwicHJvY2Vzcy9icm93c2VyXCIsXHJcbiAgICAgICAgc3RyZWFtOiBcInN0cmVhbS1icm93c2VyaWZ5XCIsXHJcbiAgICAgICAgemxpYjogXCJicm93c2VyaWZ5LXpsaWJcIixcclxuICAgICAgICB1dGlsOiBcInV0aWxcIixcclxuICAgICAgICBmaW5kOiAvXn4uKy8sXHJcbiAgICAgICAgcmVwbGFjZW1lbnQ6ICh2YWwpID0+IHtcclxuICAgICAgICAgIHJldHVybiB2YWwucmVwbGFjZSgvXn4vLCBcIlwiKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgXVxyXG4gIH0sXHJcbiAgYnVpbGQ6IHtcclxuICAgIGxpYjoge1xyXG4gICAgICBlbnRyeTogXCJzcmMvbWFpbi5qc3hcIixcclxuICAgICAgbmFtZTogXCJFbWJlZGRlZEFueXRoaW5nTExNXCIsXHJcbiAgICAgIGZvcm1hdHM6IFtcInVtZFwiXSxcclxuICAgICAgZmlsZU5hbWU6IChfZm9ybWF0KSA9PiBgYW55dGhpbmdsbG0tY2hhdC13aWRnZXQuanNgXHJcbiAgICB9LFxyXG4gICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICBleHRlcm5hbDogW1xyXG4gICAgICAgIC8vIFJlZHVjZXMgdHJhbnNmb3JtYXRpb24gdGltZSBieSA1MCUgYW5kIHdlIGRvbid0IGV2ZW4gdXNlIHRoaXMgdmFyaWFudCwgc28gd2UgY2FuIGlnbm9yZS5cclxuICAgICAgICAvQHBob3NwaG9yLWljb25zXFwvcmVhY3RcXC9kaXN0XFwvc3NyL1xyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAgY29tbW9uanNPcHRpb25zOiB7XHJcbiAgICAgIHRyYW5zZm9ybU1peGVkRXNNb2R1bGVzOiB0cnVlXHJcbiAgICB9LFxyXG4gICAgY3NzQ29kZVNwbGl0OiBmYWxzZSxcclxuICAgIGFzc2V0c0lubGluZUxpbWl0OiAxMDAwMDAwMDAsXHJcbiAgICBtaW5pZnk6IFwiZXNidWlsZFwiLFxyXG4gICAgb3V0RGlyOiBcImRpc3RcIixcclxuICAgIGVtcHR5T3V0RGlyOiB0cnVlLFxyXG4gICAgaW5saW5lRHluYW1pY0ltcG9ydHM6IHRydWUsXHJcbiAgICBhc3NldHNEaXI6IFwiXCIsXHJcbiAgICBzb3VyY2VtYXA6IFwiaW5saW5lXCJcclxuICB9LFxyXG4gIG9wdGltaXplRGVwczoge1xyXG4gICAgZXNidWlsZE9wdGlvbnM6IHtcclxuICAgICAgZGVmaW5lOiB7XHJcbiAgICAgICAgZ2xvYmFsOiBcImdsb2JhbFRoaXNcIlxyXG4gICAgICB9LFxyXG4gICAgICBwbHVnaW5zOiBbXVxyXG4gICAgfVxyXG4gIH1cclxufSlcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxVc2VyXFxcXERlc2t0b3BcXFxcYWxleFxcXFx3b3JrXFxcXGtlZW4tbWNwXFxcXHNocmlkendhcmQtc3VwcG9ydC1lbWJlZGRpbmdcXFxcZW1iZWRkaW5nXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxVc2VyXFxcXERlc2t0b3BcXFxcYWxleFxcXFx3b3JrXFxcXGtlZW4tbWNwXFxcXHNocmlkendhcmQtc3VwcG9ydC1lbWJlZGRpbmdcXFxcZW1iZWRkaW5nXFxcXHBvc3Rjc3MuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9Vc2VyL0Rlc2t0b3AvYWxleC93b3JrL2tlZW4tbWNwL3NocmlkendhcmQtc3VwcG9ydC1lbWJlZGRpbmcvZW1iZWRkaW5nL3Bvc3Rjc3MuY29uZmlnLmpzXCI7aW1wb3J0IHRhaWx3aW5kIGZyb20gJ3RhaWx3aW5kY3NzJ1xyXG5pbXBvcnQgYXV0b3ByZWZpeGVyIGZyb20gJ2F1dG9wcmVmaXhlcidcclxuaW1wb3J0IHRhaWx3aW5kQ29uZmlnIGZyb20gJy4vdGFpbHdpbmQuY29uZmlnLmpzJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHBsdWdpbnM6IFtcclxuICAgIHRhaWx3aW5kKHRhaWx3aW5kQ29uZmlnKSxcclxuICAgIGF1dG9wcmVmaXhlcixcclxuICBdLFxyXG59IiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxVc2VyXFxcXERlc2t0b3BcXFxcYWxleFxcXFx3b3JrXFxcXGtlZW4tbWNwXFxcXHNocmlkendhcmQtc3VwcG9ydC1lbWJlZGRpbmdcXFxcZW1iZWRkaW5nXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxVc2VyXFxcXERlc2t0b3BcXFxcYWxleFxcXFx3b3JrXFxcXGtlZW4tbWNwXFxcXHNocmlkendhcmQtc3VwcG9ydC1lbWJlZGRpbmdcXFxcZW1iZWRkaW5nXFxcXHRhaWx3aW5kLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvVXNlci9EZXNrdG9wL2FsZXgvd29yay9rZWVuLW1jcC9zaHJpZHp3YXJkLXN1cHBvcnQtZW1iZWRkaW5nL2VtYmVkZGluZy90YWlsd2luZC5jb25maWcuanNcIjsvKiogQHR5cGUge2ltcG9ydCgndGFpbHdpbmRjc3MnKS5Db25maWd9ICovXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBkYXJrTW9kZTogJ2ZhbHNlJyxcclxuICBwcmVmaXg6ICdhbGxtLScsXHJcbiAgY29yZVBsdWdpbnM6IHtcclxuICAgIHByZWZsaWdodDogZmFsc2UsXHJcbiAgfSxcclxuICBjb250ZW50OiB7XHJcbiAgICByZWxhdGl2ZTogdHJ1ZSxcclxuICAgIGZpbGVzOiBbXHJcbiAgICAgIFwiLi9zcmMvY29tcG9uZW50cy8qKi8qLntqcyxqc3h9XCIsXHJcbiAgICAgIFwiLi9zcmMvaG9va3MvKiovKi5qc1wiLFxyXG4gICAgICBcIi4vc3JjL21vZGVscy8qKi8qLmpzXCIsXHJcbiAgICAgIFwiLi9zcmMvcGFnZXMvKiovKi57anMsanN4fVwiLFxyXG4gICAgICBcIi4vc3JjL3V0aWxzLyoqLyouanNcIixcclxuICAgICAgXCIuL3NyYy8qLmpzeFwiLFxyXG4gICAgICBcIi4vaW5kZXguaHRtbFwiLFxyXG4gICAgXVxyXG4gIH0sXHJcbiAgdGhlbWU6IHtcclxuICAgIGV4dGVuZDoge1xyXG4gICAgICByb3RhdGU6IHtcclxuICAgICAgICBcIjI3MFwiOiBcIjI3MGRlZ1wiLFxyXG4gICAgICAgIFwiMzYwXCI6IFwiMzYwZGVnXCJcclxuICAgICAgfSxcclxuICAgICAgY29sb3JzOiB7XHJcbiAgICAgICAgXCJibGFjay05MDBcIjogXCIjMTQxNDE0XCIsXHJcbiAgICAgICAgYWNjZW50OiBcIiMzRDQxNDdcIixcclxuICAgICAgICBcInNpZGViYXItYnV0dG9uXCI6IFwiIzMxMzUzQVwiLFxyXG4gICAgICAgIHNpZGViYXI6IFwiIzI1MjcyQ1wiLFxyXG4gICAgICAgIFwiaGlzdG9yaWNhbC1tc2ctc3lzdGVtXCI6IFwicmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA1KTtcIixcclxuICAgICAgICBcImhpc3RvcmljYWwtbXNnLXVzZXJcIjogXCIjMkMyRjM1XCIsXHJcbiAgICAgICAgb3V0bGluZTogXCIjNEU1MTUzXCIsXHJcbiAgICAgICAgXCJwcmltYXJ5LWJ1dHRvblwiOiBcIiM0NkM4RkZcIixcclxuICAgICAgICBzZWNvbmRhcnk6IFwiIzJDMkYzNlwiLFxyXG4gICAgICAgIFwiZGFyay1pbnB1dFwiOiBcIiMxODE4MUJcIixcclxuICAgICAgICBcIm1vYmlsZS1vbmJvYXJkaW5nXCI6IFwiIzJDMkYzNVwiLFxyXG4gICAgICAgIFwiZGFyay1oaWdobGlnaHRcIjogXCIjMUMxRTIxXCIsXHJcbiAgICAgICAgXCJkYXJrLXRleHRcIjogXCIjMjIyNjI4XCIsXHJcbiAgICAgICAgZGVzY3JpcHRpb246IFwiI0QyRDVEQlwiLFxyXG4gICAgICAgIFwieC1idXR0b25cIjogXCIjOUNBM0FGXCJcclxuICAgICAgfSxcclxuICAgICAgYmFja2dyb3VuZEltYWdlOiB7XHJcbiAgICAgICAgXCJwcmVmZXJlbmNlLWdyYWRpZW50XCI6XHJcbiAgICAgICAgICBcImxpbmVhci1ncmFkaWVudCgxODBkZWcsICM1QTVDNjMgMCUsIHJnYmEoOTAsIDkyLCA5OSwgMC4yOCkgMTAwJSk7XCIsXHJcbiAgICAgICAgXCJjaGF0LW1zZy11c2VyLWdyYWRpZW50XCI6XHJcbiAgICAgICAgICBcImxpbmVhci1ncmFkaWVudCgxODBkZWcsICMzRDQxNDcgMCUsICMyQzJGMzUgMTAwJSk7XCIsXHJcbiAgICAgICAgXCJzZWxlY3RlZC1wcmVmZXJlbmNlLWdyYWRpZW50XCI6XHJcbiAgICAgICAgICBcImxpbmVhci1ncmFkaWVudCgxODBkZWcsICMzMTMyMzYgMCUsIHJnYmEoNjMuNDAsIDY0LjkwLCA3MC4xMywgMCkgMTAwJSk7XCIsXHJcbiAgICAgICAgXCJtYWluLWdyYWRpZW50XCI6IFwibGluZWFyLWdyYWRpZW50KDE4MGRlZywgIzNENDE0NyAwJSwgIzJDMkYzNSAxMDAlKVwiLFxyXG4gICAgICAgIFwibW9kYWwtZ3JhZGllbnRcIjogXCJsaW5lYXItZ3JhZGllbnQoMTgwZGVnLCAjM0Q0MTQ3IDAlLCAjMkMyRjM1IDEwMCUpXCIsXHJcbiAgICAgICAgXCJzaWRlYmFyLWdyYWRpZW50XCI6IFwibGluZWFyLWdyYWRpZW50KDkwZGVnLCAjNUI2MTZBIDAlLCAjM0Y0MzRCIDEwMCUpXCIsXHJcbiAgICAgICAgXCJsb2dpbi1ncmFkaWVudFwiOiBcImxpbmVhci1ncmFkaWVudCgxODBkZWcsICMzRDQxNDcgMCUsICMyQzJGMzUgMTAwJSlcIixcclxuICAgICAgICBcIm1lbnUtaXRlbS1ncmFkaWVudFwiOlxyXG4gICAgICAgICAgXCJsaW5lYXItZ3JhZGllbnQoOTBkZWcsICMzRDQxNDcgMCUsICMyQzJGMzUgMTAwJSlcIixcclxuICAgICAgICBcIm1lbnUtaXRlbS1zZWxlY3RlZC1ncmFkaWVudFwiOlxyXG4gICAgICAgICAgXCJsaW5lYXItZ3JhZGllbnQoOTBkZWcsICM1QjYxNkEgMCUsICMzRjQzNEIgMTAwJSlcIixcclxuICAgICAgICBcIndvcmtzcGFjZS1pdGVtLWdyYWRpZW50XCI6XHJcbiAgICAgICAgICBcImxpbmVhci1ncmFkaWVudCg5MGRlZywgIzNENDE0NyAwJSwgIzJDMkYzNSAxMDAlKVwiLFxyXG4gICAgICAgIFwid29ya3NwYWNlLWl0ZW0tc2VsZWN0ZWQtZ3JhZGllbnRcIjpcclxuICAgICAgICAgIFwibGluZWFyLWdyYWRpZW50KDkwZGVnLCAjNUI2MTZBIDAlLCAjM0Y0MzRCIDEwMCUpXCIsXHJcbiAgICAgICAgXCJzd2l0Y2gtc2VsZWN0ZWRcIjogXCJsaW5lYXItZ3JhZGllbnQoMTQ2ZGVnLCAjNUI2MTZBIDAlLCAjM0Y0MzRCIDEwMCUpXCJcclxuICAgICAgfSxcclxuICAgICAgZm9udEZhbWlseToge1xyXG4gICAgICAgIHNhbnM6IFtcclxuICAgICAgICAgIFwicGx1cy1qYWthcnRhLXNhbnNcIixcclxuICAgICAgICAgIFwidWktc2Fucy1zZXJpZlwiLFxyXG4gICAgICAgICAgXCJzeXN0ZW0tdWlcIixcclxuICAgICAgICAgIFwiLWFwcGxlLXN5c3RlbVwiLFxyXG4gICAgICAgICAgXCJCbGlua01hY1N5c3RlbUZvbnRcIixcclxuICAgICAgICAgICdcIlNlZ29lIFVJXCInLFxyXG4gICAgICAgICAgXCJSb2JvdG9cIixcclxuICAgICAgICAgICdcIkhlbHZldGljYSBOZXVlXCInLFxyXG4gICAgICAgICAgXCJBcmlhbFwiLFxyXG4gICAgICAgICAgJ1wiTm90byBTYW5zXCInLFxyXG4gICAgICAgICAgXCJzYW5zLXNlcmlmXCIsXHJcbiAgICAgICAgICAnXCJBcHBsZSBDb2xvciBFbW9qaVwiJyxcclxuICAgICAgICAgICdcIlNlZ29lIFVJIEVtb2ppXCInLFxyXG4gICAgICAgICAgJ1wiU2Vnb2UgVUkgU3ltYm9sXCInLFxyXG4gICAgICAgICAgJ1wiTm90byBDb2xvciBFbW9qaVwiJ1xyXG4gICAgICAgIF1cclxuICAgICAgfSxcclxuICAgICAgYW5pbWF0aW9uOiB7XHJcbiAgICAgICAgc3dlZXA6IFwic3dlZXAgMC41cyBlYXNlLWluLW91dFwiXHJcbiAgICAgIH0sXHJcbiAgICAgIGtleWZyYW1lczoge1xyXG4gICAgICAgIHN3ZWVwOiB7XHJcbiAgICAgICAgICBcIjAlXCI6IHsgdHJhbnNmb3JtOiBcInNjYWxlWCgwKVwiLCB0cmFuc2Zvcm1PcmlnaW46IFwiYm90dG9tIGxlZnRcIiB9LFxyXG4gICAgICAgICAgXCIxMDAlXCI6IHsgdHJhbnNmb3JtOiBcInNjYWxlWCgxKVwiLCB0cmFuc2Zvcm1PcmlnaW46IFwiYm90dG9tIGxlZnRcIiB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmYWRlSW46IHtcclxuICAgICAgICAgIFwiMCVcIjogeyBvcGFjaXR5OiAwIH0sXHJcbiAgICAgICAgICBcIjEwMCVcIjogeyBvcGFjaXR5OiAxIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGZhZGVPdXQ6IHtcclxuICAgICAgICAgIFwiMCVcIjogeyBvcGFjaXR5OiAxIH0sXHJcbiAgICAgICAgICBcIjEwMCVcIjogeyBvcGFjaXR5OiAwIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIHBsdWdpbnM6IFtdXHJcbn1cclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUNBLFNBQVMsb0JBQW9CO0FBQzdCLFNBQVMsZUFBZSxXQUFXOzs7QUNGb1osT0FBTyxjQUFjO0FBQzVjLE9BQU8sa0JBQWtCOzs7QUNBekIsSUFBTywwQkFBUTtBQUFBLEVBQ2IsVUFBVTtBQUFBLEVBQ1YsUUFBUTtBQUFBLEVBQ1IsYUFBYTtBQUFBLElBQ1gsV0FBVztBQUFBLEVBQ2I7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLFVBQVU7QUFBQSxJQUNWLE9BQU87QUFBQSxNQUNMO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxNQUNOLFFBQVE7QUFBQSxRQUNOLE9BQU87QUFBQSxRQUNQLE9BQU87QUFBQSxNQUNUO0FBQUEsTUFDQSxRQUFRO0FBQUEsUUFDTixhQUFhO0FBQUEsUUFDYixRQUFRO0FBQUEsUUFDUixrQkFBa0I7QUFBQSxRQUNsQixTQUFTO0FBQUEsUUFDVCx5QkFBeUI7QUFBQSxRQUN6Qix1QkFBdUI7QUFBQSxRQUN2QixTQUFTO0FBQUEsUUFDVCxrQkFBa0I7QUFBQSxRQUNsQixXQUFXO0FBQUEsUUFDWCxjQUFjO0FBQUEsUUFDZCxxQkFBcUI7QUFBQSxRQUNyQixrQkFBa0I7QUFBQSxRQUNsQixhQUFhO0FBQUEsUUFDYixhQUFhO0FBQUEsUUFDYixZQUFZO0FBQUEsTUFDZDtBQUFBLE1BQ0EsaUJBQWlCO0FBQUEsUUFDZix1QkFDRTtBQUFBLFFBQ0YsMEJBQ0U7QUFBQSxRQUNGLGdDQUNFO0FBQUEsUUFDRixpQkFBaUI7QUFBQSxRQUNqQixrQkFBa0I7QUFBQSxRQUNsQixvQkFBb0I7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
