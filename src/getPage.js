const puppeteer = require('puppeteer');

/** whether to actually launch a window or not */
const HEADLESS = false;

const getPage = async () => {
  // const browserFetcher = puppeteer.createBrowserFetcher({
  //   product: 'firefox',
  // });
  // const revisionInfo = await browserFetcher.download('77');

  const browser = await puppeteer.launch({
    // executablePath: '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
    // executablePath: revisionInfo.executablePath,
    // product: 'firefox',
    headless: HEADLESS,
    // user data dir saves logins, cookies, etc
    userDataDir: '~/.puppeteer-user',
    handleSIGINT: false,
    ignoreDefaultArgs: ['--enable-automation'],
  });

  process.on('SIGINT', () =>
    browser
      .close()
      .then(() => process.exit(0))
      .catch(() => process.exit(0))
  );

  const pages = await browser.pages();
  const page = pages[0];

  page.on('close', () => process.exit(0));

  return page;
};

module.exports = getPage;
