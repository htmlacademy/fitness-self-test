const YOUTUBE_URL_RE = /youtu.*be/i;

module.exports = async function (page, scenario) {
  const intercept = async (request, targetUrl) => {
    if (YOUTUBE_URL_RE.test(request.url())) {
      request.abort();
    } else {
      request.continue();
    }
  };
  await page.setRequestInterception(true);
  page.on('request', intercept);
};
