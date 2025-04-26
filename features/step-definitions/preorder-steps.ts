import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { PreorderProductPage } from '../pages/PreorderProductPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import dotenv from 'dotenv';

/**
 * Load environment variables from .env file
 */
dotenv.config();

/**
 * Background steps - Run before each scenario
 */

/**
 * Navigate to the preorder product page and verify it loads
 */
Given('I am on the preorder product page', async function() {
  const preorderProductPage = new PreorderProductPage(this.page);
  await preorderProductPage.navigateToPreorderProductPage();
  
  // Verify page loaded correctly with title
  const title = await this.page.title();
  expect(title).toBeTruthy();
});

/**
 * Preorder Checkout Scenario Steps
 */

/**
 * Click the pre-order button on product page
 */
When('I click on the pre-order button', async function() {
  const preorderProductPage = new PreorderProductPage(this.page);
  await preorderProductPage.clickPreorderButton();
});

/**
 * Verify cart notification appears after adding to cart
 */
When('The cart notification is visible', async function() {
  const preorderProductPage = new PreorderProductPage(this.page);
  
  // Check visibility using page object method
  const isVisible = await preorderProductPage.isCartNotificationVisible();
  expect(isVisible).toBe(true);
});

/**
 * Click checkout button from cart notification
 */
When('I click on the checkout button', async function() {
  const preorderProductPage = new PreorderProductPage(this.page);
  await preorderProductPage.clickCheckoutButton();
});

/**
 * Fill checkout form with customer information
 */
When('I fill in the checkout form', async function() {
  try {
    // Wait for checkout page to fully load
    await this.page.waitForLoadState('domcontentloaded');
    
    const checkoutPage = new CheckoutPage(this.page);
    await checkoutPage.fillCheckoutForm();
  } catch (error) {
    console.error('Error in checkout form step:', error);
    await this.page.screenshot({ path: 'checkout-form-error.png' });
    throw error;
  }
});

/**
 * Click the complete/pay button to finalize order
 */
When('I click on Complete button', async function() {
  try {
    // Take screenshot before clicking the button
    await this.page.screenshot({ path: 'before-complete-button.png' });
    
    // Verify we're on the right page
    if (!this.page.url().includes('/checkout')) {
      console.warn('Not on checkout page when trying to click complete button');
    }
    
    const checkoutPage = new CheckoutPage(this.page);
    await checkoutPage.clickCompleteOrderButton();
    
  } catch (error) {
    console.error('Error clicking complete button:', error);
    await this.page.screenshot({ path: 'complete-button-error.png' });
    throw error;
  }
});

/**
 * Verify order placement was successful
 */
Then('The order is successfully placed', async function() {
  try {
    // Wait for page transitions to complete
    await this.page.waitForTimeout('5000');
    
    const checkoutPage = new CheckoutPage(this.page);
    
    // Verify success message is displayed
    const orderSuccess = await checkoutPage.verifyOrderSuccess();
    expect(orderSuccess).toBe(true);
    
  } catch (error) {
    console.error('Error verifying order success:', error);
    throw error;
  }
});

/**
 * Fill email field with random generated email
 */
When('I fill in the email address', async function() {
  const preorderProductPage = new PreorderProductPage(this.page);
  const usedEmail = await preorderProductPage.fillInEmailAddress();
  console.log(`Used email: ${usedEmail}`); // For debugging
});


/**
 * Notify Me Scenario Steps
 */

/**
 * Click the notify me button for out-of-stock products
 */
Given('I am clicking on the notify me button', async function() {
  const preorderProductPage = new PreorderProductPage(this.page);
  await preorderProductPage.clickNotifyMeButton();
});

/**
 * Fill email and prepare for notification subscription
 */
When('I fill in the email address and click on the notify me button', async function() {
  const preorderProductPage = new PreorderProductPage(this.page);
  const usedEmail = await preorderProductPage.fillInEmailAddress();
  console.log(`Used email: ${usedEmail}`); // For debugging
});

/**
 * Click the notify me button on the popup modal
 */
When('I click on the notify me button on popup', async function() {
  const preorderProductPage = new PreorderProductPage(this.page);
  await preorderProductPage.clickNotifyMeButtonOnPopup();
});

/**
 * Verify notification confirmation is displayed
 */
Then('I should see a notification', async function() {
  // Wait for notification to appear
  await this.page.waitForTimeout(5000);
  
  try {
    const preorderProductPage = new PreorderProductPage(this.page);
    const isVisible = await preorderProductPage.verifyNotification();
    expect(isVisible).toBe(true);
  } catch (error) {
    console.error('Error verifying notification:', error);
    throw error;
  }
});