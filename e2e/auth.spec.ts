import { test, expect } from '@playwright/test'

/**
 * Journey 1: 온보딩 + 인증
 */
test.describe('인증 플로우', () => {
  test('로그인 페이지 렌더링', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: /로그인|스토리지/i })).toBeVisible()
    await expect(page.getByPlaceholder(/이메일/i)).toBeVisible()
    await expect(page.getByPlaceholder(/비밀번호/i)).toBeVisible()
  })

  test('빈 폼 제출 시 유효성 검사', async ({ page }) => {
    await page.goto('/login')
    const submitBtn = page.getByRole('button', { name: /로그인/i })
    await submitBtn.click()
    // HTML5 required validation 또는 에러 메시지
    await expect(page.getByPlaceholder(/이메일/i)).toBeFocused()
  })

  test('잘못된 자격증명 오류 표시', async ({ page }) => {
    await page.goto('/login')
    await page.getByPlaceholder(/이메일/i).fill('wrong@example.com')
    await page.getByPlaceholder(/비밀번호/i).fill('wrongpassword123')
    await page.getByRole('button', { name: /로그인/i }).click()
    // 에러 메시지 표시 확인
    await expect(page.getByText(/이메일 또는 비밀번호|잘못된|오류/i)).toBeVisible({ timeout: 8000 })
  })

  test('회원가입 페이지 이동', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('link', { name: /회원가입|계정 만들기/i }).click()
    await expect(page).toHaveURL(/signup/)
  })
})
