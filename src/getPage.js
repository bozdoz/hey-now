const puppeteer = require('puppeteer');
const { getConfig } = require('./config');

/** whether to actually launch a window or not */
const getPage = async () => {
  const { firefox, headless, executablePath } = getConfig();

  /** @type {puppeteer.LaunchOptions} */
  const options = {
    headless,
    // user data dir saves logins, cookies, etc
    userDataDir: '~/.puppeteer-user',
    handleSIGINT: false,
    args: ['--no-default-browser-check'],
    ignoreDefaultArgs: ['--enable-automation'],
  };

  if (firefox) {
    const browserFetcher = puppeteer.createBrowserFetcher({
      product: 'firefox',
    });
    const revisionInfo = await browserFetcher.download('77');

    options.executablePath = revisionInfo.executablePath;
    options.product = 'firefox';
  }

  // adds any chromium/firefox(?) product
  if (executablePath) {
    options.executablePath = executablePath;
  }

  const browser = await puppeteer.launch(options);

  // don't throw errors if user cancels
  process.on('SIGINT', () =>
    browser
      .close()
      .then(() => process.exit(0))
      .catch(() => process.exit(0))
  );

  // no need to open a new page if browser starts with one
  const pages = await browser.pages();
  const page = pages[0] || (await browser.newPage());

  page.on('close', () => process.exit(0));

  return page;
};

module.exports = getPage;
