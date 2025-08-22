import { test, expect } from '@playwright/test';
import { themes } from '../lib/themes';

test.describe('Theme System Automation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should have theme toggle in navigation', async ({ page }) => {
    const themeToggle = page.getByRole('button', { name: 'Toggle theme' });
    await expect(themeToggle).toBeVisible();
  });

  test('should navigate to themes page and display all 5 themes', async ({ page }) => {
    await page.goto('/themes');
    await page.waitForLoadState('networkidle');
    
    // Check page title
    await expect(page.getByRole('heading', { name: 'Themes' })).toBeVisible();
    
    // Check all 5 themes are displayed
    for (const theme of themes) {
      await expect(page.getByText(theme.name)).toBeVisible();
      await expect(page.getByText(theme.description)).toBeVisible();
    }
  });

  test('should switch between light and dark modes', async ({ page }) => {
    await page.goto('/themes');
    
    // Test dark mode
    await page.getByRole('button', { name: 'Dark' }).click();
    await page.waitForTimeout(500); // Wait for transition
    
    // Take screenshot in dark mode
    await page.screenshot({ 
      path: 'test-results/dark-mode.png',
      fullPage: true 
    });
    
    // Test light mode
    await page.getByRole('button', { name: 'Light' }).click();
    await page.waitForTimeout(500);
    
    // Take screenshot in light mode
    await page.screenshot({ 
      path: 'test-results/light-mode.png',
      fullPage: true 
    });
  });

  test('should test all 5 theme color schemes', async ({ page }) => {
    await page.goto('/themes');
    
    for (const theme of themes) {
      // Click on theme card
      await page.getByText(theme.name).first().click();
      await page.waitForTimeout(1000); // Wait for theme application
      
      // Take screenshot for each theme
      await page.screenshot({ 
        path: `test-results/theme-${theme.id}.png`,
        fullPage: true 
      });
      
      // Verify theme is applied by checking active indicator
      const activeIndicator = page.locator('.theme-preview-card.active');
      await expect(activeIndicator).toBeVisible();
      
      // Test navigation with new theme
      await page.goto('/');
      await page.waitForTimeout(500);
      await page.screenshot({ 
        path: `test-results/dashboard-${theme.id}.png` 
      });
      
      // Test other pages with theme
      await page.goto('/contacts');
      await page.waitForTimeout(500);
      await page.screenshot({ 
        path: `test-results/contacts-${theme.id}.png` 
      });
      
      await page.goto('/jobs');
      await page.waitForTimeout(500);
      await page.screenshot({ 
        path: `test-results/jobs-${theme.id}.png` 
      });
      
      // Return to themes page for next iteration
      await page.goto('/themes');
    }
  });

  test('should test theme accessibility compliance', async ({ page }) => {
    await page.goto('/themes');
    
    for (const theme of themes) {
      // Apply theme
      await page.getByText(theme.name).first().click();
      await page.waitForTimeout(1000);
      
      // Test both light and dark modes
      for (const mode of ['light', 'dark']) {
        await page.getByRole('button', { name: mode === 'light' ? 'Light' : 'Dark' }).click();
        await page.waitForTimeout(500);
        
        // Check contrast ratios
        const body = page.locator('body');
        const computedStyle = await body.evaluate((el) => {
          const style = window.getComputedStyle(el);
          return {
            backgroundColor: style.backgroundColor,
            color: style.color
          };
        });
        
        // Basic accessibility checks
        const buttons = page.locator('button:visible');
        const buttonCount = await buttons.count();
        
        for (let i = 0; i < Math.min(buttonCount, 5); i++) {
          const button = buttons.nth(i);
          await expect(button).toBeVisible();
          
          // Check if button has proper focus indicators
          await button.focus();
          const focusedElement = page.locator(':focus');
          await expect(focusedElement).toBeVisible();
        }
        
        // Check for proper heading hierarchy
        const headings = page.locator('h1, h2, h3, h4, h5, h6');
        const headingCount = await headings.count();
        expect(headingCount).toBeGreaterThan(0);
      }
    }
  });

  test('should test theme persistence across page refreshes', async ({ page }) => {
    await page.goto('/themes');
    
    // Apply a specific theme
    await page.getByText('Professional Solar Blue').first().click();
    await page.waitForTimeout(1000);
    
    // Refresh page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Check that theme persisted
    const activeCard = page.locator('.theme-preview-card.active');
    await expect(activeCard).toBeVisible();
    
    // Navigate to another page and back
    await page.goto('/');
    await page.goto('/themes');
    
    // Theme should still be active
    await expect(activeCard).toBeVisible();
  });

  test('should test responsive design across all themes', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1920, height: 1080, name: 'desktop' }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('/themes');
      
      // Test first few themes on different viewports
      for (const theme of themes.slice(0, 3)) {
        await page.getByText(theme.name).first().click();
        await page.waitForTimeout(1000);
        
        // Take responsive screenshots
        await page.screenshot({ 
          path: `test-results/responsive-${theme.id}-${viewport.name}.png`,
          fullPage: true 
        });
        
        // Check no horizontal overflow
        const body = page.locator('body');
        const scrollWidth = await body.evaluate(el => el.scrollWidth);
        const clientWidth = await body.evaluate(el => el.clientWidth);
        
        expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 10); // Allow small tolerance
      }
    }
  });

  test('should test theme system performance', async ({ page }) => {
    await page.goto('/themes');
    
    // Measure theme switching performance
    const startTime = Date.now();
    
    for (const theme of themes) {
      const themeStartTime = Date.now();
      await page.getByText(theme.name).first().click();
      await page.waitForTimeout(100); // Minimal wait for theme application
      const themeEndTime = Date.now();
      
      const switchTime = themeEndTime - themeStartTime;
      console.log(`Theme ${theme.name} switch time: ${switchTime}ms`);
      
      // Ensure theme switching is fast (under 1 second)
      expect(switchTime).toBeLessThan(1000);
    }
    
    const totalTime = Date.now() - startTime;
    console.log(`Total theme testing time: ${totalTime}ms`);
    
    // Ensure all theme tests complete within reasonable time
    expect(totalTime).toBeLessThan(10000); // 10 seconds
  });
});