/**
 * Utility script to run Cucumber tests multiple times
 * 
 * Usage:
 *   node ./scripts/repeat-test.js [times] [tag]
 * 
 * Example:
 *   node ./scripts/repeat-test.js 5 @preorder-checkout
 *
 * Parameters:
 *   times - Number of times to run the test (default: 3)
 *   tag - Cucumber tag to run (default: @preorder-checkout)
 */

const { execSync } = require('child_process');
const times = process.argv[2] || 3; // Default to 3 times if not specified
const tag = process.argv[3] || '@preorder-checkout'; // Default tag

console.log(`Running ${tag} tests ${times} times...`);

for (let i = 0; i < times; i++) {
  console.log(`\n--- Run ${i+1}/${times} ---\n`);
  try {
    execSync(`npm run test:cucumber -- --tags ${tag}`, { stdio: 'inherit' });
  } catch (e) {
    console.log(`Run ${i+1} failed with error: ${e.message}`);
  }
} 