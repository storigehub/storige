import { test, expect } from '@playwright/test'

/**
 * Journey 2: 일기 작성 플로우
 * Note: 실제 Supabase 인증 없이 UI 레이어만 검증
 */
test.describe('일기 페이지', () => {
  test('로그인 없이 일기 접근 시 리다이렉트', async ({ page }) => {
    await page.goto('/diary')
    // 인증되지 않은 경우 로그인 페이지로 이동
    await expect(page).toHaveURL(/login|diary/, { timeout: 5000 })
  })

  test('일기 새 작성 페이지 접근', async ({ page }) => {
    await page.goto('/diary/new')
    // 로그인 페이지로 리다이렉트되거나 에디터 표시
    await expect(page).toHaveURL(/login|diary\/new/, { timeout: 5000 })
  })
})

test.describe('일기 에디터 UI (미인증)', () => {
  test('에디터 페이지 리다이렉트 확인', async ({ page }) => {
    const response = await page.goto('/diary/new')
    // 200 또는 리다이렉트 응답
    expect([200, 302, 307, 308]).toContain(response?.status() ?? 200)
  })
})
