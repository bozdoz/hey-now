const puppeteer = require('puppeteer');
const { getConfig } = require('./config');

/** whether to actually launch a window or not */
const getPage = async () => {
  // TODO: optional Firefox or Brave or Edge, etc
  // const browserFetcher = puppeteer.createBrowserFetcher({
  //   product: 'firefox',
  // });
  // const revisionInfo = await browserFetcher.download('77');

  const browser = await puppeteer.launch({
    // executablePath: revisionInfo.executablePath,
    // product: 'firefox',
    headless: getConfig().headless,
    // user data dir saves logins, cookies, etc
    userDataDir: '~/.puppeteer-user',
    handleSIGINT: false,
    args: ['--no-default-browser-check'],
    ignoreDefaultArgs: ['--enable-automation'],
  });

  // don't throw errors if user cancels
  process.on('SIGINT', () =>
    browser
      .close()
      .then(() => process.exit(0))
      .catch(() => process.exit(0))
  );

  // no need to open a new page; browser starts with one
  const pages = await browser.pages();
  const page = pages[0];

  page.on('close', () => process.exit(0));

  return page;
};

module.exports = getPage;
