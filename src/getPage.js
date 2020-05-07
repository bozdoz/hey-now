const path = require('path');
const puppeteer = require('puppeteer');
const { getConfig } = require('./config');
const logger = require('./logger');
const { setCookies } = require('./cookies');

const log = logger('getPage');

const getPage = async () => {
  const { firefox, headless, executablePath } = getConfig();

  // user data dir saves logins, cookies, etc
  const userDataDir = path.resolve('.puppeteer-user');

  log('using userDataDir', userDataDir);

  /** @type {puppeteer.LaunchOptions} */
  const options = {
    headless,
    args: ['--no-default-browser-check', `--user-data-dir=${userDataDir}`],
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

  const page = await browser.newPage();

  // set cookies for headless-forgetfulness
  await setCookies(page);

  return page;
};

module.exports = getPage;
