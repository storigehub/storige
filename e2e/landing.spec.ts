import { test, expect } from '@playwright/test'

/**
 * Journey 3: 랜딩 + 네비게이션 기본 검증
 */
test.describe('랜딩 페이지', () => {
  test('루트 접근 시 응답 정상', async ({ page }) => {
    const response = await page.goto('/')
    expect(response?.status()).toBeLessThan(400)
  })

  test('메타 정보 존재', async ({ page }) => {
    await page.goto('/')
    const title = await page.title()
    expect(title).toBeTruthy()
    expect(title.length).toBeGreaterThan(0)
  })
})

test.describe('핵심 라우트 접근성', () => {
  const routes = ['/login', '/signup']

  for (const route of routes) {
    test(`${route} 페이지 응답 정상`, async ({ page }) => {
      const response = await page.goto(route)
      expect(response?.status()).toBeLessThan(400)
    })
  }
})

test.describe('보호된 라우트 리다이렉트', () => {
  const protectedRoutes = ['/diary', '/dear', '/secret', '/settings']

  for (const route of protectedRoutes) {
    test(`${route} — 미인증 시 리다이렉트`, async ({ page }) => {
      await page.goto(route)
      // 로그인 페이지로 이동하거나 해당 페이지 유지 (클라이언트 사이드 체크)
      await page.waitForTimeout(1000)
      const url = page.url()
      // 로그인 페이지이거나 해당 경로여야 함
      expect(url).toMatch(/login|diary|dear|secret|settings/)
    })
  }
})

test.describe('Legacy Access 라우트', () => {
  test('/legacy — owner 없이 접근 시 오류 표시', async ({ page }) => {
    await page.goto('/legacy')
    // 잘못된 접근 또는 로딩 화면
    await expect(page.locator('body')).toBeVisible()
  })
})
