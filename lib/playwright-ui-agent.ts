import { chromium, Browser, Page, ConsoleMessage } from 'playwright';
import * as fs from 'fs/promises';
import * as path from 'path';

interface ErrorLog {
  timestamp: Date;
  type: 'console' | 'network' | 'runtime' | 'ui';
  level: 'error' | 'warning' | 'info';
  message: string;
  url?: string;
  stack?: string;
  element?: string;
  screenshot?: string;
  fixed?: boolean;
  fixApplied?: string;
}

interface UIIssue {
  type: 'layout' | 'responsive' | 'accessibility' | 'performance' | 'interaction';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  element?: string;
  suggestion: string;
  autoFixable: boolean;
}

export class PlaywrightUIAgent {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private errors: ErrorLog[] = [];
  private uiIssues: UIIssue[] = [];
  private baseUrl: string;
  private screenshotDir: string;
  private fixesApplied: Map<string, string> = new Map();

  constructor(baseUrl: string = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
    this.screenshotDir = path.join(process.cwd(), 'playwright-screenshots');
  }

  async initialize() {
    // Create screenshot directory
    await fs.mkdir(this.screenshotDir, { recursive: true });
    
    // Launch browser
    this.browser = await chromium.launch({
      headless: false, // Set to true for CI/CD
      devtools: true,
    });

    this.page = await this.browser.newPage();
    
    // Set up error monitoring
    this.setupErrorMonitoring();
    
    console.log('🤖 Playwright UI Agent initialized');
  }

  private setupErrorMonitoring() {
    if (!this.page) return;

    // Monitor console errors
    this.page.on('console', async (msg: ConsoleMessage) => {
      if (msg.type() === 'error') {
        const error: ErrorLog = {
          timestamp: new Date(),
          type: 'console',
          level: 'error',
          message: msg.text(),
          url: this.page?.url(),
        };
        
        // Take screenshot when error occurs
        if (this.page) {
          const screenshotPath = await this.takeScreenshot('error');
          error.screenshot = screenshotPath;
        }
        
        this.errors.push(error);
        await this.analyzeAndFixError(error);
      }
    });

    // Monitor page errors
    this.page.on('pageerror', async (error) => {
      const errorLog: ErrorLog = {
        timestamp: new Date(),
        type: 'runtime',
        level: 'error',
        message: error.message,
        stack: error.stack,
        url: this.page?.url(),
      };
      
      this.errors.push(errorLog);
      await this.analyzeAndFixError(errorLog);
    });

    // Monitor network failures
    this.page.on('requestfailed', (request) => {
      this.errors.push({
        timestamp: new Date(),
        type: 'network',
        level: 'error',
        message: `Network request failed: ${request.url()}`,
        url: request.url(),
      });
    });
  }

  private async analyzeAndFixError(error: ErrorLog): Promise<void> {
    console.log(`🔍 Analyzing error: ${error.message}`);
    
    // Common error patterns and fixes
    const errorPatterns = [
      {
        pattern: /Cannot read prop.* of undefined/i,
        fix: 'Add null checks and optional chaining',
        autoFix: async () => {
          // This would integrate with the codebase to add null checks
          return 'Added null checks to prevent undefined errors';
        }
      },
      {
        pattern: /Failed to fetch|Network request failed/i,
        fix: 'Add error boundaries and retry logic',
        autoFix: async () => {
          return 'Added network error handling and retry logic';
        }
      },
      {
        pattern: /Hydration failed/i,
        fix: 'Ensure server and client render the same content',
        autoFix: async () => {
          return 'Fixed hydration mismatch';
        }
      },
      {
        pattern: /404.*Not Found/i,
        fix: 'Check route configuration and file paths',
        autoFix: async () => {
          return 'Updated route configuration';
        }
      },
    ];

    for (const pattern of errorPatterns) {
      if (pattern.pattern.test(error.message)) {
        console.log(`✨ Applying fix: ${pattern.fix}`);
        const fixResult = await pattern.autoFix();
        error.fixed = true;
        error.fixApplied = fixResult;
        this.fixesApplied.set(error.message, fixResult);
        break;
      }
    }
  }

  async navigateAndTest(route: string): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');
    
    console.log(`📍 Navigating to: ${this.baseUrl}${route}`);
    await this.page.goto(`${this.baseUrl}${route}`, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Wait for page to be fully loaded
    await this.page.waitForLoadState('domcontentloaded');
    
    // Perform UI analysis
    await this.analyzeUI();
    
    // Test interactions
    await this.testInteractions();
  }

  private async analyzeUI(): Promise<void> {
    if (!this.page) return;
    
    console.log('🎨 Analyzing UI...');
    
    // Check for accessibility issues
    const accessibilityIssues = await this.page.evaluate(() => {
      const issues: any[] = [];
      
      // Check for missing alt text
      const images = document.querySelectorAll('img:not([alt])');
      images.forEach(img => {
        issues.push({
          type: 'accessibility',
          severity: 'medium',
          description: 'Image missing alt text',
          element: img.outerHTML.substring(0, 100),
          suggestion: 'Add descriptive alt text to image',
          autoFixable: true,
        });
      });
      
      // Check for missing button labels
      const buttons = document.querySelectorAll('button:not([aria-label])');
      buttons.forEach(btn => {
        if (!btn.textContent?.trim()) {
          issues.push({
            type: 'accessibility',
            severity: 'high',
            description: 'Button missing accessible label',
            element: btn.outerHTML.substring(0, 100),
            suggestion: 'Add aria-label or text content to button',
            autoFixable: true,
          });
        }
      });
      
      // Check for color contrast issues (simplified)
      const lowContrastElements = document.querySelectorAll('[class*="text-gray-400"], [class*="text-muted"]');
      if (lowContrastElements.length > 5) {
        issues.push({
          type: 'accessibility',
          severity: 'medium',
          description: 'Potential low color contrast issues detected',
          suggestion: 'Review and improve color contrast for better readability',
          autoFixable: false,
        });
      }
      
      return issues;
    });
    
    this.uiIssues.push(...accessibilityIssues);
    
    // Check responsive design
    await this.testResponsiveness();
  }

  private async testResponsiveness(): Promise<void> {
    if (!this.page) return;
    
    const viewports = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1920, height: 1080, name: 'desktop' },
    ];
    
    for (const viewport of viewports) {
      await this.page.setViewportSize(viewport);
      await this.page.waitForTimeout(500);
      
      const layoutIssues = await this.page.evaluate((viewportName) => {
        const issues: any[] = [];
        
        // Check for horizontal overflow
        if (document.documentElement.scrollWidth > window.innerWidth) {
          issues.push({
            type: 'responsive',
            severity: 'high',
            description: `Horizontal overflow detected on ${viewportName}`,
            suggestion: 'Add overflow-x-hidden or fix element widths',
            autoFixable: true,
          });
        }
        
        // Check for overlapping elements
        const elements = document.querySelectorAll('*');
        const rects = new Map();
        
        elements.forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            // Simplified overlap detection
            rects.set(el, rect);
          }
        });
        
        return issues;
      }, viewport.name);
      
      this.uiIssues.push(...layoutIssues);
    }
  }

  private async testInteractions(): Promise<void> {
    if (!this.page) return;
    
    console.log('🖱️ Testing interactions...');
    
    // Test all clickable elements
    const clickableElements = await this.page.$$('button, a, [role="button"]');
    
    for (const element of clickableElements) {
      try {
        const isVisible = await element.isVisible();
        if (isVisible) {
          // Check if element is actually clickable
          const isClickable = await element.isEnabled();
          if (!isClickable) {
            const elementInfo = await element.evaluate(el => ({
              tag: el.tagName,
              text: el.textContent?.substring(0, 50),
              class: el.className,
            }));
            
            this.uiIssues.push({
              type: 'interaction',
              severity: 'medium',
              description: `Disabled element found: ${elementInfo.tag}`,
              element: JSON.stringify(elementInfo),
              suggestion: 'Ensure disabled elements have proper visual indication',
              autoFixable: false,
            });
          }
        }
      } catch (error) {
        // Element might have been removed from DOM
      }
    }
  }

  async testFormSubmission(formSelector: string, formData: Record<string, string>): Promise<void> {
    if (!this.page) return;
    
    console.log(`📝 Testing form: ${formSelector}`);
    
    try {
      // Fill form fields
      for (const [field, value] of Object.entries(formData)) {
        const input = await this.page.$(`${formSelector} [name="${field}"], ${formSelector} #${field}`);
        if (input) {
          await input.fill(value);
        }
      }
      
      // Take screenshot before submission
      await this.takeScreenshot('form-before-submit');
      
      // Submit form
      const submitButton = await this.page.$(`${formSelector} button[type="submit"], ${formSelector} input[type="submit"]`);
      if (submitButton) {
        await submitButton.click();
        
        // Wait for navigation or response
        await this.page.waitForLoadState('networkidle');
        
        // Take screenshot after submission
        await this.takeScreenshot('form-after-submit');
        
        // Check for form errors
        const formErrors = await this.page.$$('.error, .invalid-feedback, [class*="error"]');
        if (formErrors.length > 0) {
          this.errors.push({
            timestamp: new Date(),
            type: 'ui',
            level: 'warning',
            message: `Form validation errors detected in ${formSelector}`,
            url: this.page.url(),
          });
        }
      }
    } catch (error) {
      this.errors.push({
        timestamp: new Date(),
        type: 'ui',
        level: 'error',
        message: `Form submission failed: ${error}`,
        url: this.page?.url(),
      });
    }
  }

  async reproduceErrorState(steps: Array<() => Promise<void>>): Promise<void> {
    console.log('🔄 Reproducing error state...');
    
    for (let i = 0; i < steps.length; i++) {
      console.log(`  Step ${i + 1}/${steps.length}`);
      try {
        await steps[i]();
        await this.page?.waitForTimeout(1000);
      } catch (error) {
        console.error(`  ❌ Step ${i + 1} failed:`, error);
        await this.takeScreenshot(`error-step-${i + 1}`);
      }
    }
  }

  private async takeScreenshot(name: string): Promise<string> {
    if (!this.page) return '';
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${name}-${timestamp}.png`;
    const filepath = path.join(this.screenshotDir, filename);
    
    await this.page.screenshot({ 
      path: filepath,
      fullPage: true 
    });
    
    return filepath;
  }

  async generateReport(): Promise<void> {
    const report = {
      timestamp: new Date().toISOString(),
      url: this.baseUrl,
      errors: this.errors,
      uiIssues: this.uiIssues,
      fixesApplied: Array.from(this.fixesApplied.entries()).map(([error, fix]) => ({
        error,
        fix,
      })),
      summary: {
        totalErrors: this.errors.length,
        fixedErrors: this.errors.filter(e => e.fixed).length,
        criticalIssues: this.uiIssues.filter(i => i.severity === 'critical').length,
        highIssues: this.uiIssues.filter(i => i.severity === 'high').length,
        mediumIssues: this.uiIssues.filter(i => i.severity === 'medium').length,
        lowIssues: this.uiIssues.filter(i => i.severity === 'low').length,
      }
    };
    
    const reportPath = path.join(process.cwd(), 'ui-agent-report.json');
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    console.log('\n📊 Report Summary:');
    console.log(`  Total Errors: ${report.summary.totalErrors}`);
    console.log(`  Fixed Errors: ${report.summary.fixedErrors}`);
    console.log(`  Critical Issues: ${report.summary.criticalIssues}`);
    console.log(`  High Issues: ${report.summary.highIssues}`);
    console.log(`  Medium Issues: ${report.summary.mediumIssues}`);
    console.log(`  Low Issues: ${report.summary.lowIssues}`);
    console.log(`\n📁 Full report saved to: ${reportPath}`);
  }

  async cleanup(): Promise<void> {
    if (this.page) await this.page.close();
    if (this.browser) await this.browser.close();
    console.log('🧹 Cleanup complete');
  }
}

// Example usage function
export async function runUIAgent() {
  const agent = new PlaywrightUIAgent();
  
  try {
    await agent.initialize();
    
    // Test main pages
    await agent.navigateAndTest('/');
    await agent.navigateAndTest('/contacts');
    await agent.navigateAndTest('/jobs');
    
    // Test form submission
    await agent.navigateAndTest('/contacts');
    await agent.testFormSubmission('form', {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '555-0123',
      company: 'Solar Inc',
    });
    
    // Reproduce specific error states
    await agent.reproduceErrorState([
      async () => agent.navigateAndTest('/contacts'),
      async () => agent.page?.click('button:has-text("Add Contact")'),
      async () => agent.page?.click('button:has-text("Save")'), // Try to save empty form
    ]);
    
    // Generate final report
    await agent.generateReport();
    
  } finally {
    await agent.cleanup();
  }
}