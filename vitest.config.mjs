import { defineConfig } from "vitest/config";

const browserName = process.env.PLAYWRIGHT_BROWSER ?? "chromium";

export default defineConfig({
  test: {
    coverage: {
      include: [
        "src/**/*.ts"
      ],
      provider: "v8",
      reporter: [
        "text",
        "lcovonly"
      ]
    },
    projects: [
      {
        test: {
          environment: "node",
          globals: true,
          include: [
            "test/**/*.test.ts"
          ],
          name: "node"
        }
      },
      {
        test: {
          browser: {
            enabled: true,
            headless: true,
            provider: "playwright",
            instances: [
              {
                browser: browserName
              }
            ]
          },
          globals: true,
          include: [
            "test/**/*.test.ts"
          ],
          name: "browser"
        }
      }
    ]
  }
});
