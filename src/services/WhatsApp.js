const {
  errors: { TimeoutError },
} = require('puppeteer');
const fs = require('fs');
const path = require('path');
const Service = require('./Service');
const { getConfig } = require('../config');
const logger = require('../logger');
const { saveCookies } = require('../cookies');
const { wait } = require('../util');

const log = logger('WhatsApp');

class WhatsApp extends Service {
  async navigateToURL() {
    const { headless } = getConfig();
    const url = 'https://web.whatsapp.com';

    log(`Navigating to ${url}`);

    // whatsapp needs the user agent in order to show the QR code login
    // first, add listeners to get and update user agent
    const settingUserAgent = this.setUserAgent();
    // second, send a request to get user agent
    await this.page.goto(url);
    log('navigated');

    // last, make sure the user agent is updated
    await Promise.race([settingUserAgent, wait(5000)]);

    log('agent set');

    const errorMessage = () =>
      // eslint-disable-next-line no-console
      console.error(
        'TimeoutError: You may need to scan the QR code with your phone'
      );

    // wait for app, if headless, summon a window
    try {
      await this.page.waitForSelector('.app', {
        timeout: 2000,
      });
    } catch (e) {
      // qr code in canvas
      if (e instanceof TimeoutError) {
        // wait for qr
        if (headless) {
          this.getQRCode();
        }
      }
    }

    try {
      await this.screenshot('before-app.png');
      await this.page.waitForSelector('.app');
      await this.screenshot('after-app.png');
    } catch (e) {
      await this.screenshot('app-timeout.png');
      if (e instanceof TimeoutError) {
        errorMessage();
      }
      throw e;
    }

    try {
      // once logged in, save cookies
      await saveCookies(this.page);
    } catch (e) {
      log('failed saving cookies');
    }
  }

  async findMessageBox(friend) {
    const clickOnText = async (text) => {
      const elems = await this.page.$x(`//*[contains(text(), '${text}')]`);

      await elems[0].click();
    };

    // click friend name
    try {
      await clickOnText(friend);
    } catch (e) {
      throw new Error(`Cannot find friend: ${friend}`);
    }

    // click message box
    await clickOnText('Type a message');
  }

  /**
   * @returns {Promise<void>}
   */
  async setUserAgent() {
    const { headless } = getConfig();
    if (!headless) {
      return Promise.resolve();
    }

    await this.page.setRequestInterception(true);
    let userAgentResolve;
    const userAgentPromise = new Promise((resolve) => {
      userAgentResolve = resolve;
    });
    let userAgent;

    this.page.on('request', (request) => {
      const headers = request.headers();

      log('request url', request.url());
      log('request headers', headers);

      if (!userAgent) {
        try {
          userAgent = headers['user-agent'];

          log('Found userAgent', userAgent);

          // remove "Headless" is the key
          userAgent = userAgent.replace('Headless', '');
          // update current request
          headers['user-agent'] = userAgent;

          // update future
          this.page.setUserAgent(userAgent).then(userAgentResolve);
        } catch (e) {
          // pass
        }
      }

      request.continue({ headers });
    });

    return userAgentPromise;
  }

  async getQRCode() {
    await this.page.waitForSelector('canvas');

    // screenshot QR code to scan
    await this.screenshot('qr.png');
  }

  async screenshot(filename) {
    const img = path.join('screenshots', filename);

    fs.mkdirSync('screenshots', {
      recursive: true,
    });

    await this.page.screenshot({
      path: img,
    });

    log('screenshotted: ', img);
  }
}

module.exports = WhatsApp;
