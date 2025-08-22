#!/usr/bin/env node

import { PlaywrightUIAgent } from '../lib/playwright-ui-agent';

async function main() {
  console.log('🚀 Starting Playwright UI Agent...\n');
  
  const agent = new PlaywrightUIAgent('http://localhost:3000');
  
  try {
    // Initialize the agent
    await agent.initialize();
    
    // Test Dashboard
    console.log('\n📊 Testing Dashboard...');
    await agent.navigateAndTest('/');
    
    // Test Contacts Page
    console.log('\n👥 Testing Contacts Page...');
    await agent.navigateAndTest('/contacts');
    
    // Test Contact Form Submission
    console.log('\n📝 Testing Contact Form...');
    await agent.testFormSubmission('form', {
      name: 'Test User',
      email: 'test@example.com',
      phone: '555-1234',
      company: 'Test Solar Company',
      status: 'lead',
      notes: 'This is a test contact created by the UI agent',
    });
    
    // Test Jobs Page
    console.log('\n💼 Testing Jobs Page...');
    await agent.navigateAndTest('/jobs');
    
    // Test Error Reproduction
    console.log('\n🔄 Testing Error States...');
    await agent.reproduceErrorState([
      // Navigate to contacts
      async () => {
        console.log('  - Navigating to contacts...');
        await agent.navigateAndTest('/contacts');
      },
      // Click Add Contact
      async () => {
        console.log('  - Clicking Add Contact...');
        const page = (agent as any).page;
        if (page) {
          const addButton = await page.$('button:has-text("Add Contact")');
          if (addButton) await addButton.click();
        }
      },
      // Try to save empty form (should trigger validation)
      async () => {
        console.log('  - Attempting to save empty form...');
        const page = (agent as any).page;
        if (page) {
          const saveButton = await page.$('button:has-text("Save")');
          if (saveButton) await saveButton.click();
        }
      },
    ]);
    
    // Test Tasks Page (might not exist yet)
    console.log('\n✅ Testing Tasks Page...');
    try {
      await agent.navigateAndTest('/tasks');
    } catch (error) {
      console.log('  ⚠️ Tasks page not implemented yet');
    }
    
    // Test Schedule Page (might not exist yet)
    console.log('\n📅 Testing Schedule Page...');
    try {
      await agent.navigateAndTest('/schedule');
    } catch (error) {
      console.log('  ⚠️ Schedule page not implemented yet');
    }
    
    // Generate comprehensive report
    console.log('\n📈 Generating Report...');
    await agent.generateReport();
    
  } catch (error) {
    console.error('❌ Agent error:', error);
  } finally {
    // Cleanup
    await agent.cleanup();
  }
  
  console.log('\n✨ UI Agent scan complete!');
}

// Run the agent
main().catch(console.error);