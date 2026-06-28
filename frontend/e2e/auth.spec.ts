import { expect, test } from '@playwright/test'

// TODO: Enable after Phase 3 auth implementation
// Requires: AuthButton.vue, AuthCallback.vue, useAuthGuard, /profile page
test.describe.skip('Auth flow', () => {
  test('shows login button on home page', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('button', { name: /Log in/ })).toBeVisible()
  })

  test('redirects to OAuth provider on login click', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Log in with Google/ }).click()
    // Should redirect to backend OAuth endpoint
    await expect(page).toHaveURL(/oauth|google/)
  })

  test('handles OAuth callback and stores token', async ({ page }) => {
    await page.goto('/auth/callback?code=test-code')
    // Should redirect to home after successful auth
    await expect(page).toHaveURL('/')
    await expect(page.getByText('Test User')).toBeVisible()
  })

  test('shows user profile when authenticated', async ({ page }) => {
    await page.goto('/profile')
    await expect(page.getByText('Test User')).toBeVisible()
    await expect(page.getByText('test@example.com')).toBeVisible()
  })

  test('logs out successfully', async ({ page }) => {
    await page.goto('/profile')
    await page.getByRole('button', { name: /Log out/ }).click()
    await expect(page).toHaveURL('/')
    await expect(page.getByRole('button', { name: /Log in/ })).toBeVisible()
  })

  test('redirects to login for protected routes', async ({ page }) => {
    await page.goto('/profile')
    // Without auth, should redirect to home or show login prompt
    await expect(page.getByRole('button', { name: /Log in/ })).toBeVisible()
  })
})
