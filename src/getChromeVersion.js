const path = require('path');
const puppeteer = require('puppeteer-core');

const getChromeVersion = async () => {
  const browserFetcher = puppeteer.createBrowserFetcher({
    path: path.join(process.cwd(), 'browser'),
  });

  // possibly this version is the only one that keeps headless cookies
  const revNumber = 666595;
  const revisionInfo = await browserFetcher.download(revNumber);

  return revisionInfo.executablePath;
};

module.exports = getChromeVersion;
