const fs = require('fs');
const logger = require('./logger');

const log = logger('cookies');

/**
 * @param {import('puppeteer').Page} page
 */
const saveCookies = async (page) => {
  log('getting cookies');
  // This gets all cookies from all URLs, not just the current URL
  let cookies = await page._client.send('Network.getAllCookies');
  cookies = JSON.stringify(cookies);

  log(cookies);

  fs.writeFileSync('cookies.json', cookies);
  log('Updated cookies');
};

/**
 * @param {import('puppeteer').Page} page
 */
const setCookies = async (page) => {
  try {
    let cookies = fs.readFileSync('cookies.json');
    cookies = JSON.parse(cookies).cookies;
    log('Loading cookies into browser');
    log(cookies);
    await page.setCookie(...cookies);
  } catch (err) {
    log('failed setting cookies', err);
  }
};

module.exports = {
  saveCookies,
  setCookies,
};
