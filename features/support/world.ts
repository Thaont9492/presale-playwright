import { setWorldConstructor } from '@cucumber/cucumber';
import { BrowserContext, Page } from '@playwright/test';

/**
 * ScenarioInfo interface to track test execution details
 */
interface ScenarioInfo {
  startTime: Date;
  name: string;
}

/**
 * Product interface to store product information
 */
interface Product {
  name: string;
  url: string;
}

/**
 * World class to share context between steps
 */
export class CustomWorld {
  context!: BrowserContext;
  page!: Page;
  testName?: string;
  scenarioInfo?: ScenarioInfo;
  productInfo?: Record<string, Product>;
  currentProduct?: string;
}

setWorldConstructor(CustomWorld);