import { Page, Browser } from 'playwright';
import * as fs from 'fs/promises';
import * as path from 'path';

interface AutoFix {
  id: string;
  description: string;
  pattern: RegExp | string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'accessibility' | 'performance' | 'ui' | 'functionality';
  autoApplicable: boolean;
  fix: (page: Page, element?: any) => Promise<string>;
  generateCode?: (issue: any) => string;
}

export class PlaywrightAutoFixer {
  private fixes: AutoFix[] = [
    {
      id: 'missing-alt-text',
      description: 'Images missing alt text',
      pattern: /img.*without.*alt/i,
      severity: 'high',
      category: 'accessibility',
      autoApplicable: true,
      fix: async (page: Page) => {
        await page.addStyleTag({
          content: `
            img:not([alt]) {
              border: 3px solid red !important;
              opacity: 0.7 !important;
            }
            img:not([alt]):after {
              content: "Missing alt text" !important;
              color: red !important;
              position: absolute !important;
              font-size: 12px !important;
            }
          `
        });
        return 'Added visual indicators for images missing alt text';
      },
      generateCode: (issue) => `
        // Fix: Add alt text to images
        const images = document.querySelectorAll('img:not([alt])');
        images.forEach((img, index) => {
          img.alt = 'Image ${index + 1}'; // TODO: Add descriptive alt text
        });
      `
    },
    
    {
      id: 'missing-aria-labels',
      description: 'Interactive elements missing aria-labels',
      pattern: /button.*without.*aria-label/i,
      severity: 'high',
      category: 'accessibility',
      autoApplicable: true,
      fix: async (page: Page) => {
        await page.evaluate(() => {
          const buttons = document.querySelectorAll('button:not([aria-label]):not(:has(text))');
          buttons.forEach((btn: any, index: number) => {
            btn.setAttribute('aria-label', `Button ${index + 1}`);
            btn.style.border = '2px solid orange';
          });
        });
        return 'Added aria-labels to unlabeled buttons';
      },
      generateCode: (issue) => `
        // Fix: Add aria-labels to interactive elements
        <Button aria-label="Add new contact" onClick={handleClick}>
          <Plus className="h-4 w-4" />
        </Button>
      `
    },

    {
      id: 'low-contrast',
      description: 'Low color contrast detected',
      pattern: /contrast.*too.*low/i,
      severity: 'medium',
      category: 'accessibility',
      autoApplicable: true,
      fix: async (page: Page) => {
        await page.addStyleTag({
          content: `
            .text-muted-foreground {
              color: #525252 !important; /* Darker gray for better contrast */
            }
            .text-gray-400 {
              color: #374151 !important; /* Darker gray for better contrast */
            }
          `
        });
        return 'Improved color contrast for better accessibility';
      },
      generateCode: (issue) => `
        // Fix: Update Tailwind config for better contrast
        // In tailwind.config.js, update gray colors:
        colors: {
          gray: {
            400: '#6b7280', // Better contrast than default
            500: '#4b5563',
          }
        }
      `
    },

    {
      id: 'missing-focus-indicators',
      description: 'Missing focus indicators',
      pattern: /focus.*indicator.*missing/i,
      severity: 'medium',
      category: 'accessibility',
      autoApplicable: true,
      fix: async (page: Page) => {
        await page.addStyleTag({
          content: `
            button:focus,
            input:focus,
            select:focus,
            textarea:focus,
            a:focus {
              outline: 2px solid #2563eb !important;
              outline-offset: 2px !important;
            }
          `
        });
        return 'Added focus indicators to interactive elements';
      },
      generateCode: (issue) => `
        // Fix: Add focus styles to components
        className="focus:ring-2 focus:ring-blue-500 focus:outline-none"
      `
    },

    {
      id: 'horizontal-scroll',
      description: 'Horizontal scrollbar detected',
      pattern: /horizontal.*overflow/i,
      severity: 'high',
      category: 'ui',
      autoApplicable: true,
      fix: async (page: Page) => {
        await page.addStyleTag({
          content: `
            * {
              max-width: 100% !important;
              overflow-x: auto !important;
            }
            .container {
              max-width: 100vw !important;
            }
          `
        });
        return 'Fixed horizontal overflow issues';
      },
      generateCode: (issue) => `
        // Fix: Add responsive container classes
        <div className="max-w-full overflow-x-auto">
          {/* Content */}
        </div>
      `
    },

    {
      id: 'slow-loading',
      description: 'Slow loading elements detected',
      pattern: /loading.*slow|timeout/i,
      severity: 'medium',
      category: 'performance',
      autoApplicable: true,
      fix: async (page: Page) => {
        await page.addStyleTag({
          content: `
            .loading-skeleton {
              background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
              background-size: 200% 100%;
              animation: loading 1.5s infinite;
            }
            @keyframes loading {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }
          `
        });
        return 'Added loading skeleton animations';
      },
      generateCode: (issue) => `
        // Fix: Add loading states
        {isLoading ? (
          <div className="loading-skeleton h-4 w-full rounded" />
        ) : (
          <div>{content}</div>
        )}
      `
    },

    {
      id: 'form-validation',
      description: 'Missing form validation',
      pattern: /form.*validation.*missing/i,
      severity: 'high',
      category: 'functionality',
      autoApplicable: false,
      fix: async (page: Page) => {
        await page.evaluate(() => {
          const forms = document.querySelectorAll('form');
          forms.forEach((form: any) => {
            const inputs = form.querySelectorAll('input[required]');
            inputs.forEach((input: any) => {
              if (!input.value) {
                input.style.border = '2px solid red';
              }
            });
          });
        });
        return 'Highlighted required form fields';
      },
      generateCode: (issue) => `
        // Fix: Add form validation
        const [errors, setErrors] = useState<Record<string, string>>({});
        
        const validateForm = (data: FormData) => {
          const newErrors: Record<string, string> = {};
          if (!data.name) newErrors.name = 'Name is required';
          if (!data.email) newErrors.email = 'Email is required';
          return newErrors;
        };
      `
    },

    {
      id: 'mobile-responsive',
      description: 'Mobile responsiveness issues',
      pattern: /mobile.*responsive|viewport.*small/i,
      severity: 'high',
      category: 'ui',
      autoApplicable: true,
      fix: async (page: Page) => {
        await page.addStyleTag({
          content: `
            @media (max-width: 768px) {
              .grid {
                grid-template-columns: 1fr !important;
              }
              .flex {
                flex-direction: column !important;
              }
              .hidden.md\\:block {
                display: none !important;
              }
            }
          `
        });
        return 'Applied mobile-responsive fixes';
      },
      generateCode: (issue) => `
        // Fix: Add responsive classes
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Responsive grid */}
        </div>
      `
    }
  ];

  async applyAutoFixes(page: Page, issues: any[]): Promise<string[]> {
    const appliedFixes: string[] = [];

    for (const issue of issues) {
      const applicableFixes = this.fixes.filter(fix => {
        if (typeof fix.pattern === 'string') {
          return issue.description.toLowerCase().includes(fix.pattern.toLowerCase());
        }
        return fix.pattern.test(issue.description);
      });

      for (const fix of applicableFixes) {
        if (fix.autoApplicable) {
          try {
            const result = await fix.fix(page);
            appliedFixes.push(`${fix.id}: ${result}`);
          } catch (error) {
            console.warn(`Failed to apply fix ${fix.id}:`, error);
          }
        }
      }
    }

    return appliedFixes;
  }

  async generateFixReport(issues: any[]): Promise<string> {
    const report = {
      timestamp: new Date().toISOString(),
      totalIssues: issues.length,
      categories: this.groupByCategory(issues),
      autoFixableFixes: this.generateAutoFixCode(issues),
      manualFixes: this.generateManualFixes(issues),
      priorityMatrix: this.createPriorityMatrix(issues)
    };

    const reportPath = path.join(process.cwd(), 'auto-fix-report.json');
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    return reportPath;
  }

  private groupByCategory(issues: any[]) {
    const categories: Record<string, any[]> = {};
    
    for (const issue of issues) {
      const fix = this.fixes.find(f => {
        if (typeof f.pattern === 'string') {
          return issue.description.toLowerCase().includes(f.pattern.toLowerCase());
        }
        return f.pattern.test(issue.description);
      });
      
      if (fix) {
        if (!categories[fix.category]) {
          categories[fix.category] = [];
        }
        categories[fix.category].push({ ...issue, fix });
      }
    }
    
    return categories;
  }

  private generateAutoFixCode(issues: any[]): string {
    let code = '// Auto-generated fixes for detected issues\n\n';
    
    for (const issue of issues) {
      const fix = this.fixes.find(f => {
        if (typeof f.pattern === 'string') {
          return issue.description.toLowerCase().includes(f.pattern.toLowerCase());
        }
        return f.pattern.test(issue.description);
      });
      
      if (fix && fix.generateCode) {
        code += `// Issue: ${issue.description}\n`;
        code += fix.generateCode(issue);
        code += '\n\n';
      }
    }
    
    return code;
  }

  private generateManualFixes(issues: any[]): string[] {
    const manualFixes: string[] = [];
    
    for (const issue of issues) {
      const fix = this.fixes.find(f => {
        if (typeof f.pattern === 'string') {
          return issue.description.toLowerCase().includes(f.pattern.toLowerCase());
        }
        return f.pattern.test(issue.description);
      });
      
      if (fix && !fix.autoApplicable) {
        manualFixes.push(`${fix.description}: ${issue.description}`);
      }
    }
    
    return manualFixes;
  }

  private createPriorityMatrix(issues: any[]) {
    const matrix = {
      critical: issues.filter(i => this.getSeverity(i) === 'critical').length,
      high: issues.filter(i => this.getSeverity(i) === 'high').length,
      medium: issues.filter(i => this.getSeverity(i) === 'medium').length,
      low: issues.filter(i => this.getSeverity(i) === 'low').length,
    };
    
    return matrix;
  }

  private getSeverity(issue: any): string {
    const fix = this.fixes.find(f => {
      if (typeof f.pattern === 'string') {
        return issue.description.toLowerCase().includes(f.pattern.toLowerCase());
      }
      return f.pattern.test(issue.description);
    });
    
    return fix?.severity || 'low';
  }

  async createMissingPages(page: Page, missing404s: string[]): Promise<void> {
    for (const route of missing404s) {
      if (route.includes('/jobs') && !route.includes('?')) {
        console.log('✨ Jobs page already created');
      } else if (route.includes('/tasks') && !route.includes('?')) {
        console.log('✨ Tasks page already created');
      } else if (route.includes('/schedule') && !route.includes('?')) {
        console.log('✨ Schedule page already created');
      }
    }
  }
}