const indexSections = [
   { section: 'hero', misMatchThreshold: 3 },
   { section: 'about', misMatchThreshold: 3 },
   { section: 'price', misMatchThreshold: 2 },
  { section: 'games', misMatchThreshold: 3 },
  { section: 'features', misMatchThreshold: 2 },
  { section: 'offers', misMatchThreshold: 3 },
  { section: 'faq', misMatchThreshold: 2 },
  { section: 'reviews', misMatchThreshold: 2 },
  { section: 'footer', misMatchThreshold: 2 }
];

  module.exports = {
    "id": "supergym test-pp",
    "viewports": [
      {
        "label": "desktop",
        "width": 1366,
        "height": 800,
      },
      {
        "label": "tablet",
        "width": 768,
        "height": 800,
      },
      {
        "label": "mobile",
        "width": 320,
        "height": 800,
      },
    ],
    "onReadyScript": "onReady.cjs",
    "resembleOutputOptions": {
      "ignoreAntialiasing": true,
      "errorType": "movementDifferenceIntensity",
      "transparency": 0.3,
      scaleToSameSize: false
    },
    "scenarios": [
      ...indexSections.map(({ section, misMatchThreshold }) => ({
        "label": `${section}`,
        "url": "http://localhost:3000/index.html",
        "referenceUrl": "./figma/index.html",
        selectors: [`[data-test="${section}"]`],
        misMatchThreshold: misMatchThreshold || 5,
        requireSameDimensions: true,
        delay: 500
      })),
    ],
    fileNameTemplate: '{scenarioLabel}_{viewportLabel}',
    "paths": {
      "bitmaps_reference": "bitmaps_reference/test-pp",
      "bitmaps_test": "backstop_data/bitmaps_test",
      "engine_scripts": "engine_scripts",
      "html_report": "backstop_data/html_report",
      "json_report": "backstop_data/json_report",
    },
    "report": ["browser", "json"],
    "engine": "puppeteer",
    "engineOptions": {
      "args": ["--no-sandbox"],
      "gotoParameters": { "waitUntil": ["load", "networkidle0"], timeout: 20000 },
    },
    "asyncCaptureLimit": 9,
    "asyncCompareLimit": 50,
    "debug": false,
    "debugWindow": false
  }
