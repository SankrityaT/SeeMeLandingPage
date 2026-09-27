/** Registered by the shared suite's website.spec.mjs with its isolated fixtures. */
export function coachMobileTests(test, expect) {
  test('coach page fits narrow screens and reveals content without scroll delays', async ({ page }) => {
    const failures = [];
    page.on('pageerror', error => failures.push(error.message));
    for (const width of [320, 390, 600, 767, 850, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      const requests = [];
      const track = request => requests.push(request.url());
      page.on('request', track);
      await page.goto('/partner');
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.locator('.partner-product-section')).toHaveCount(4);
      for (const section of await page.locator('.partner-product-section').all()) {
        await expect(section).toHaveCSS('opacity', '1');
        await expect(section).toHaveCSS('filter', 'none');
      }
      if (width <= 767) {
        await expect(page.locator('html')).not.toHaveClass(/lenis/);
        await expect(page.locator('.partner-hero-product--left')).toBeHidden();
        await expect(page.locator('.partner-hero-product--right')).toBeHidden();
        await expect(page.locator('.partner-hero-stage')).toHaveCSS('opacity', '1');
        await expect(page.locator('.partner-hero-stage')).toHaveCSS('transform', 'none');
        await expect(page.locator('.partner-hero-product--main img')).toHaveJSProperty('currentSrc', new URL('/coach-platform/workspace-hero-small.webp', page.url()).href);
        expect(requests.some(url => /(?:clone|studio)-hero\.(?:png|webp)/.test(url))).toBe(false);
        expect(requests.some(url => /workspace-hero\.webp/.test(url))).toBe(false);
      }
      await page.getByRole('link', { name: 'Explore the platform' }).click();
      await expect(page.locator('#workspace-heading')).toBeInViewport();
      for (const section of await page.locator('.partner-product-section').all()) {
        await section.scrollIntoViewIfNeeded();
        await expect(section.locator('img').last()).toHaveJSProperty('complete', true);
        expect(await section.locator('img').last().evaluate(img => img.naturalWidth)).toBeGreaterThan(0);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.getByRole('button', { name: 'Apply to pilot', exact: true }).click();
      await expect(page.locator('.partner-form-error')).toContainText('Please fill in');
      page.off('request', track);
    }
    expect(failures).toEqual([]);
  });
  test('screenshots have immediate previews while network images are delayed', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    let releaseImages;
    const held = new Promise(resolve => { releaseImages = resolve; });
    const requested = new Set();
    await page.route('**/coach-platform/*-mobile.webp', async route => {
      requested.add(route.request().url());
      await held;
      await route.continue();
    });
    try {
      await page.goto('/partner', { waitUntil: 'domcontentloaded' });
      await expect.poll(() => requested.size).toBe(4);
      const previews = page.locator('.partner-story-preview');
      await expect(previews).toHaveCount(4);
      for (const preview of await previews.all()) {
        const state = await preview.evaluate(element => ({
          background: getComputedStyle(element).backgroundImage,
          height: element.getBoundingClientRect().height,
          loaded: element.querySelector('img').naturalWidth,
        }));
        expect(state.background).toContain('data:image/webp;base64,');
        expect(state.height).toBeGreaterThan(100);
        expect(state.loaded).toBe(0);
      }
      await previews.last().scrollIntoViewIfNeeded();
      await expect(previews.last()).toBeInViewport();
    } finally {
      releaseImages();
    }
    for (const img of await page.locator('.partner-story-preview img').all()) {
      await expect.poll(() => img.evaluate(image => image.naturalWidth)).toBeGreaterThan(0);
    }
  });
  test('coach content respects reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/partner');
    await expect(page.locator('html')).not.toHaveClass(/lenis/);
    await expect(page.locator('.partner-hero-stage')).toHaveCSS('opacity', '1');
    await expect(page.locator('.partner-hero-stage')).toHaveCSS('transform', 'none');
    await page.getByRole('link', { name: 'Join the coach pilot', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Apply to pilot', exact: true })).toBeInViewport();
  });
}
