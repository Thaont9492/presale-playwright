import { Page } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Interface for checkout form fields
 * Used to structure customer information for the checkout process
 */
interface CheckoutInfo {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
}

/**
 * Page Object Model for the checkout page functionality
 * Handles form filling and order completion
 */
export class CheckoutPage {
  constructor(private page: Page) {}

  /**
   * Fills the checkout form with customer information
   * Uses environment variables with fallback to default values
   * Handles both email and shipping information fields
   */
  async fillCheckoutForm() {
    // Get checkout info with fallback to default values
    let checkoutInfo: CheckoutInfo;
    try {
      // Use environment variables directly
      checkoutInfo = {
        email: process.env.CHECKOUT_EMAIL || 'test@example.com',
        firstName: process.env.CHECKOUT_FIRST_NAME || 'John',
        lastName: process.env.CHECKOUT_LAST_NAME || 'Doe',
        address: process.env.CHECKOUT_ADDRESS || '123 Test St',
        city: process.env.CHECKOUT_CITY || 'Test City'
      };
    } catch (error) {
      console.log('Error parsing CHECKOUT_INFO, using default values');
      checkoutInfo = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Test St',
        city: 'Test City'
      };
    }
    
    // Fill email using specific selector to avoid ambiguity
    await this.page.locator('#email[type="email"]').fill(checkoutInfo.email);
    
    // Fill shipping information using specific selectors
    try {
      // First name - use visible input field, not hidden one
      const firstNameField = this.page.getByRole('textbox', { name: /first name/i }).first();
      if (await firstNameField.isVisible()) {
        await firstNameField.fill(checkoutInfo.firstName);
      }
      
      // Last name
      const lastNameField = this.page.getByRole('textbox', { name: /last name/i }).first();
      if (await lastNameField.isVisible()) {
        await lastNameField.fill(checkoutInfo.lastName);
      }
      
      // Address
      const addressField = this.page.getByRole('textbox', { name: /address/i }).first();
      if (await addressField.isVisible()) {
        await addressField.fill(checkoutInfo.address);
      }
      
      // City
      const cityField = this.page.getByRole('textbox', { name: /city/i }).first();
      if (await cityField.isVisible()) {
        await cityField.fill(checkoutInfo.city);
      }
      
      // Continue to payment if needed
      const shippingContinueButton = this.page.getByRole('button', { name: /continue to (shipping|payment)/i }).first();
      if (await shippingContinueButton.isVisible()) {
        await shippingContinueButton.click();
      }
    } catch (error) {
      console.error('Error filling shipping information:', error);
      await this.page.screenshot({ path: 'checkout-error.png' });
      throw error; // Re-throw to fail the test with proper error
    }
  }

  /**
   * Clicks the complete order button in checkout
   * Uses a specific selector targeting the payment button
   */
  async clickCompleteOrderButton() {
    const button = this.page.locator('#checkout-pay-button');
    await button.click();
  }

  /**
   * Verifies if the order was successfully placed
   * Checks for confirmation heading with appropriate timeout
   * @returns true if order confirmation is visible
   */
  async verifyOrderSuccess(): Promise<boolean> {
    const cartNotification = this.page.getByRole('heading', { name: 'Your order is confirmed'});
    return await cartNotification.isVisible({ timeout: 5000 });
  }
}