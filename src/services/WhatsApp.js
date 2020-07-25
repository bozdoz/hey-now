const {
  errors: { TimeoutError },
} = require('puppeteer-core');
const qrcode = require('qrcode-terminal');
const Service = require('./Service');
const { getConfig } = require('../config');

class WhatsApp extends Service {
  async navigateToURL() {
    const { headless } = getConfig();
    const url = 'https://web.whatsapp.com';

    const page = await this.getPage(url);
    // selector which indicates successful loading
    const appSelector = '.selectable-text';

    try {
      await page.waitForSelector(appSelector, {
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
      await this.debugScreenshot('before-app.png');
      await page.waitForSelector(appSelector);
      // kills the looping QR code script
      this.scanned = true;
      await this.debugScreenshot('after-app.png');
    } catch (e) {
      await this.debugScreenshot('app-timeout.png');
      if (e instanceof TimeoutError) {
        // eslint-disable-next-line no-console
        console.error(
          'TimeoutError: You may need to scan the QR code with your phone'
        );
      }
      throw e;
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

  async getQRCode() {
    const canvasSelector = 'canvas';

    try {
      await this.page.waitForSelector(canvasSelector);
    } catch (e) {
      // if the canvas isn't there, there's no QR code
      return;
    }

    const imageData = await this.page.evaluate(
      (selector) =>
        document.querySelector(selector).parentElement.getAttribute('data-ref'),
      canvasSelector
    );

    if (imageData !== this.imageData) {
      qrcode.generate(imageData, { small: true });
      this.imageData = imageData;
    }

    setTimeout(() => {
      if (!this.scanned) {
        this.getQRCode();
      }
    }, 2000);
  }
}

module.exports = WhatsApp;
