const path = require('path');
const puppeteer = require('puppeteer-core');
const { getConfig } = require('./config');
const getChromeVersion = require('./getChromeVersion');
const { DEFAULT_CHROMIUM_ARGS } = require('./constants');
const logger = require('./logger');

const log = logger('getPage');

const getPage = async (url) => {
  const { headless, executablePath } = getConfig();

  // user data dir saves logins, cookies, etc
  const userDataDir = path.resolve('.puppeteer-user');
  // --app removes toolbars etc
  const args = [...DEFAULT_CHROMIUM_ARGS, `--app=${url}`];

  /** @type {puppeteer.LaunchOptions} */
  const options = {
    args,
    headless,
    userDataDir,
    devtools: false,
    executablePath: executablePath || (await getChromeVersion()),
  };

  log(options);

  const browser = await puppeteer.launch(options);
  /** @type {import('puppeteer-core').Page} */
  const page = browser.pages[0] || (await browser.newPage());

  // windows?
  page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36'
  );

  return page;
};

module.exports = getPage;
