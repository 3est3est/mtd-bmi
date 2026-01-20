import { test, expect } from '@playwright/test';

const generateRandomUser = () => {
  const rand = Math.floor(Math.random() * 10000);
  return {
    name: `Test User ${rand}`,
    email: `testuser${rand}@example.com`,
    password: 'password123'
  };
};

test.describe.configure({ mode: 'serial' });

test.describe('BMI Application E2E Tests', () => {
  const user = generateRandomUser();

  test('TC1: User Registration', async ({ page }) => {
    await page.goto('/register');
    
    // Using getByLabel for better accessibility and reliability
    await page.getByLabel('Name').fill(user.name);
    await page.getByLabel('Email').fill(user.email);
    await page.getByLabel('Password').fill(user.password);
    
    await page.click('button[type="submit"]');

    // Expect redirect to login
    await expect(page).toHaveURL(/\/login/);
  });

  test('TC2: User Login', async ({ page }) => {
    await page.goto('/login');
    
    await page.getByLabel('Email').fill(user.email);
    await page.getByLabel('Password').fill(user.password);
    
    await page.click('button[type="submit"]');
    
    // Expect redirect to home/dashboard
    await expect(page).toHaveURL('/');
  });

  test('TC3: Calculate BMI', async ({ page }) => {
    // Re-login because sessions are not shared by default between tests in Playwright unless configured
    // Since we are in serial mode but new context per test, we must login again.
    // Alternatively, we could use a global setup, but re-login is simpler for this scope.
    await page.goto('/login');
    await page.getByLabel('Email').fill(user.email);
    await page.getByLabel('Password').fill(user.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/');

    await page.goto('/dashboard');
    
    // Using getByLabel matching the text in the label tags
    await page.getByLabel('Weight (kg)').fill('70');
    await page.getByLabel('Height (cm)').fill('175');
    
    await page.click('button:has-text("Calculate")');
    
    // Verify Result
    await expect(page.locator('text=Your Result')).toBeVisible();
    await expect(page.locator('text=22.86')).toBeVisible();
  });

  test('TC4: Save BMI & Verify History', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.getByLabel('Email').fill(user.email);
    await page.getByLabel('Password').fill(user.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/');

    // Dashboard -> Calculate -> Save
    await page.goto('/dashboard');
    await page.getByLabel('Weight (kg)').fill('80');
    await page.getByLabel('Height (cm)').fill('180');
    await page.click('button:has-text("Calculate")');
    
    // Wait for result to appear
    await expect(page.locator('text=24.69')).toBeVisible();
    
    // Save
    await page.click('button:has-text("Save Result")');
    await expect(page.getByText('Saved successfully!')).toBeVisible();
    
    // Go to History
    await page.goto('/history');
    
    // Verify entry exists (checking for the BMI value we just saved)
    await expect(page.getByText('24.69').first()).toBeVisible();
  });

  test('TC5: Access Reports', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.getByLabel('Email').fill(user.email);
    await page.getByLabel('Password').fill(user.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/');

    // Navigate to Reports
    await page.goto('/reports');
    
    // Verify Elements
    await expect(page.locator('h1:has-text("MIS Reports")')).toBeVisible();
    // Check for period buttons
    await expect(page.getByRole('button', { name: 'Weekly' })).toBeVisible();
    // Check for summary stats section
    await expect(page.getByText('Summary Stats')).toBeVisible();
  });
});
