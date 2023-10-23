module.exports = async (page, scenario, vp) => {
    console.log('SCENARIO > ' + scenario.label);
  
    // add more ready handlers here...
    await page.waitForFunction(() => {
      return document.fonts.ready.then(() => {
        console.log('Fonts loaded');
        return true;
      });
    });
  
    // await require('./clickAndHoverHelper')(page, scenario);
  
    if (scenario.showSelectors) {
      await Promise.all(
        scenario.showSelectors.map(async (selector) => {
          await page
            .evaluate((sel) => {
              document.querySelectorAll(sel).forEach(s => {
                s.style.visibility = 'visible';
              });
            }, selector);
        })
      );
    }
  };
  