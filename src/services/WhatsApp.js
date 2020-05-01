const {
  errors: { TimeoutError },
} = require('puppeteer');

class WhatsApp {
  constructor(page) {
    /** @type {import('puppeteer').Page>} */
    this.page = page;
  }

  async ready() {
    await this.page.goto('https://web.whatsapp.com');
    try {
      await this.page.waitForSelector('.app');
    } catch (e) {
      if (e instanceof TimeoutError) {
        // eslint-disable-next-line no-console
        console.error(
          'TimeoutError: You may need to scan the QR code with your phone; make sure the browser in getPage is set to `headless: false`'
        );
      }
      throw e;
    }
  }

  async messageFriend(friend) {
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

  async sendMessage(message) {
    await this.page.keyboard.type(message);
    await this.page.keyboard.press('Enter');
  }
}

module.exports = WhatsApp;
