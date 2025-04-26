require('dotenv').config();

module.exports = {
  default: {
    paths: ['features/**/*.feature'],
    require: ['features/step-definitions/**/*.ts', 'features/support/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      'html:cucumber-report.html',
      'json:cucumber-report.json'
    ],
    formatOptions: { snippetInterface: 'async-await' },
    publishQuiet: true,
    worldParameters: {
      headless: process.env.HEADLESS === 'true',
      browser: process.env.BROWSER || 'chromium',
      slowMo: parseInt(process.env.SLOW_MO || '0', 10),
      recordVideo: process.env.RECORD_VIDEO === 'true'
    },
    tags: 'not @wip and not @ignore'
  }
}; 