import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('galaxy-booted', '1'))
})

const settle = (page: import('@playwright/test').Page) => page.waitForTimeout(800)

test('arrow keys, digits and hash stay in sync', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1[data-heading]')).toContainText('Rishivardhan J')
  await page.keyboard.press('ArrowRight'); await settle(page)
  await expect(page).toHaveURL(/#origin$/)
  await expect(page.locator('h2[data-heading]')).toBeFocused()
  await page.keyboard.press('4'); await settle(page)
  await expect(page).toHaveURL(/#constellations$/)
  await page.goBack(); await settle(page)
  await expect(page).toHaveURL(/#origin$/)
  await expect(page).toHaveTitle(/Origin/)
})

test('case study deep link, paging and Esc', async ({ page }) => {
  await page.goto('/#star-systems/crime-analytics/architecture')
  const dlg = page.getByRole('dialog', { name: /Crime Analytics.*case study/ })
  await expect(dlg).toBeVisible()
  await expect(dlg.getByRole('img', { name: /Architecture diagram/ })).toBeVisible()
  await page.keyboard.press('ArrowRight')
  await expect(page).toHaveURL(/\/outcome$/)
  await expect(dlg.getByRole('link', { name: /Repo/ })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dlg).toBeHidden()
  await expect(page).toHaveURL(/#star-systems$/)
})

test('palette jumps to a project', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1[data-heading]')).toBeVisible()
  await page.keyboard.press('Control+k')
  await expect(page.getByRole('combobox')).toBeFocused()
  await page.keyboard.type('harvest')
  await page.keyboard.press('Enter')
  await expect(page.getByRole('dialog', { name: /HarvestPro/ })).toBeVisible()
})

for (const vp of [{ width: 375, height: 667 }, { width: 768, height: 1024 }, { width: 1440, height: 900 }]) {
  test(`no page scroll and no axe violations at ${vp.width}x${vp.height}`, async ({ page }) => {
    await page.setViewportSize(vp)
    for (const hash of ['launchpad', 'origin', 'star-systems', 'constellations', 'transmission']) {
      await page.goto(`/#${hash}`); await settle(page)
      const overflow = await page.evaluate(() => {
        const e = document.scrollingElement!
        return { x: e.scrollWidth - e.clientWidth, y: e.scrollHeight - e.clientHeight }
      })
      expect(overflow, hash).toEqual({ x: 0, y: 0 })
      const res = await new AxeBuilder({ page }).analyze()
      expect(res.violations.map((v) => `${v.id}: ${v.nodes[0].target}`), hash).toEqual([])
    }
  })
}

test('reduced motion still navigates', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('h1[data-heading]')).toBeVisible()
  await page.keyboard.press('ArrowRight')
  await expect(page).toHaveURL(/#origin$/)
})

test('works with WebGL disabled', async ({ page }) => {
  await page.goto('/?gl=0#star-systems'); await settle(page)
  await expect(page.locator('.css-planet').first()).toBeVisible()
})

test('Esc from a case study returns to Star Systems, not a blank page', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto('/#star-systems')
  await page.getByRole('button', { name: /Open mission/ }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toBeHidden()
  await expect(page.getByRole('button', { name: /Open mission/ })).toBeVisible()
  expect(errors).toEqual([])
})

test('front gate: enter orbit warps to the Launchpad', async ({ page }) => {
  await page.addInitScript(() => sessionStorage.removeItem('galaxy-booted'))
  await page.goto('/')
  const enter = page.getByRole('button', { name: /Enter orbit/ })
  await expect(enter).toBeVisible()
  const res = await new AxeBuilder({ page }).analyze()
  expect(res.violations.map((v) => `${v.id}: ${v.nodes[0].target}`)).toEqual([])
  await enter.click()
  await expect(page.locator('h1[data-heading]')).toContainText('Rishivardhan J', { timeout: 8000 })
  await expect(page).toHaveURL(/#launchpad$/)
  await expect(enter).toBeHidden()
})

test('star systems: selecting planets updates the dossier every time', async ({ page }) => {
  await page.goto('/#star-systems')
  const h = page.locator('.dossier h2')
  await expect(h).toContainText('Crime Analytics')
  for (const [name, title, repo] of [['Transit', 'Transit', false], ['HarvestPro', 'HarvestPro', false], ['Bench', 'Bench', true], ['Crime Analytics', 'Crime Analytics', true]] as const) {
    await page.getByRole('radio', { name: new RegExp(name) }).click({ force: true })
    await expect(h).toContainText(title)
    await expect(page.locator('.dossier .chip').first()).toBeVisible()
    await expect(page.locator('.dossier .actions')).toBeVisible()
    if (repo) await expect(page.getByRole('link', { name: /Repo/ })).toBeVisible()
  }
})

test('star systems: arrow keys rotate the orbit without leaving the stop; Enter opens the mission', async ({ page }) => {
  await page.goto('/#star-systems')
  await page.getByRole('radio', { name: /Crime Analytics/ }).focus()
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('.dossier h2')).toContainText('Transit')
  await expect(page).toHaveURL(/#star-systems$/)
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('Enter')
  await expect(page.getByRole('dialog', { name: /Crime Analytics.*case study/ })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toBeHidden()
})

test('star systems: brief steps open the matching case-study page', async ({ page }) => {
  await page.goto('/#star-systems')
  await page.locator('.steps button', { hasText: 'architecture' }).click()
  await expect(page).toHaveURL(/crime-analytics\/architecture$/)
})

test('constellations link lands on the right planet', async ({ page }) => {
  await page.goto('/#constellations')
  await page.getByRole('button', { name: /MongoDB/ }).click()
  await page.locator('.proj-list li button', { hasText: 'Bench' }).click()
  await expect(page.locator('.dossier h2')).toContainText('Bench', { timeout: 5000 })
})
