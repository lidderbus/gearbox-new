// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright E2E 测试配置
 * 齿轮箱选型系统
 *
 * 运行命令:
 *   npx playwright test              # 运行所有测试
 *   npx playwright test --ui         # 交互式UI模式
 *   npx playwright test --project=chromium  # 只运行Chrome测试
 */

module.exports = defineConfig({
  // 测试目录
  testDir: './e2e',

  // 测试文件匹配模式
  testMatch: '**/*.spec.{js,ts}',

  // 完全并行运行测试
  fullyParallel: true,

  // 失败时不重试 (CI环境可改为2)
  retries: process.env.CI ? 2 : 0,

  // 并发工作进程数
  workers: process.env.CI ? 1 : undefined,

  // 报告器配置
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list']
  ],

  // 全局超时设置
  timeout: 30000,

  // 期望超时
  expect: {
    timeout: 5000
  },

  // 共享配置
  use: {
    // 基础URL - 在线部署地址
    baseURL: 'http://47.99.181.195/gearbox-app/',

    // 失败时收集跟踪信息
    trace: 'on-first-retry',

    // 截图策略
    screenshot: 'only-on-failure',

    // 视频录制 (仅失败时)
    video: 'on-first-retry',

    // 导航超时
    navigationTimeout: 10000,

    // 操作超时
    actionTimeout: 5000,
  },

  // 浏览器配置
  projects: [
    // 桌面 Chrome
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },

    // 移动端 Safari (iPhone 13)
    {
      name: 'mobile',
      use: {
        ...devices['iPhone 13'],
      },
    },

    // 桌面 Firefox (可选)
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
  ],

  // 本地开发时启动开发服务器
  // webServer: {
  //   command: 'npm start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
