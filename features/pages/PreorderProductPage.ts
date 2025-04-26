import { Page } from '@playwright/test';
import dotenv from 'dotenv';
import { generateRandomEmail } from '../utils/emailGenerator';

/**
 * Load environment variables for configuration
 */
dotenv.config();

/**
 * Page Object Model for pre-order product functionality
 * Handles product page interactions, cart operations, and notification features
 */
export class PreorderProductPage {
  constructor(private page: Page) {}

  /**
   * Navigates to the preorder product page
   * Uses URL from environment variable with appropriate waiting
   * @throws Error if PREORDER_LINK environment variable is not defined
   */
  async navigateToPreorderProductPage() {
    const preorderLink = process.env.PREORDER_LINK;
    if (!preorderLink) {
      throw new Error('PREORDER_LINK environment variable is not defined');
    }
    await this.page.goto(preorderLink);
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Clicks the preorder button
   * Waits for cart/add response to ensure operation completes
   */
  async clickPreorderButton() {
    await this.page.getByRole('button', { name: /pre-?order/i })
      .or(this.page.locator('#spb__pre-order-button'))
      .click();
    // Wait for cart notification to appear
    await this.page.waitForResponse(response => 
      response.url().includes('/cart/add') && response.status() === 200, 
      { timeout: 10000 }
    );
  }

  /**
   * Checks if the cart notification is visible
   * Uses explicit timeout for better stability
   * @returns true if cart notification is visible
   */
  async isCartNotificationVisible(): Promise<boolean> {
    const cartNotification = this.page.locator('#cart-notification');
    return await cartNotification.isVisible({ timeout: 5000 });
  }

  /**
   * Clicks checkout button in the cart notification
   * Uses multiple locator strategies for resilience
   */
  async clickCheckoutButton() {
    await this.page.getByRole('button', { name: 'Checkout' })
      .or(this.page.locator('#cart-notification-form button.button--primary'))
      .click();
  }

  /**
   * Clicks the notify me button for out-of-stock products
   */
  async clickNotifyMeButton() {
    await this.page.locator('#spb__notify-btn').click();
  }

  /**
   * Fills in the email address field
   * Uses random email generator by default
   * @param email Optional specific email to use
   * @returns The email that was used (random or specified)
   */
  async fillInEmailAddress(email?: string) {
    // Use provided email or generate a random one
    const emailToUse = email || generateRandomEmail();
    
    // Fill the email field
    await this.page.locator('#spb__bis-email-input').fill(emailToUse);
    
    // Return the email that was used (useful for assertions or logging)
    return emailToUse;
  }

  /**
   * Clicks the notify me button on the popup modal
   */
  async clickNotifyMeButtonOnPopup() {
    await this.page.locator('#spb__bis-modal-btn').click();
  }

  /**
   * Verifies if notification confirmation is visible
   * @returns true if notification confirmation is visible
   */
  async verifyNotification(): Promise<boolean> {
    const notification = this.page.locator('#spb__bis-confirm-modal-text');
    return await notification.isVisible({ timeout: 5000 });
  }
}
