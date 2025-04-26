/**
 * Generates a random email address for testing
 * Creates unique emails using timestamp and random string to avoid duplicates
 * @param domain Optional domain name (defaults to example.com)
 * @returns Random email address in format test_[random]_[timestamp]@domain
 */
export function generateRandomEmail(domain = 'example.com'): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  return `test_${randomString}_${timestamp}@${domain}`;
} 