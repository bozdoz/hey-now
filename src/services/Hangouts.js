const {
  errors: { TimeoutError },
} = require('puppeteer');
const { wait } = require('../util');

class Hangouts {
  constructor(page) {
    /** @type {import('puppeteer').Page>} */
    this.page = page;
  }

  async ready() {
    await this.page.goto('https://hangouts.google.com');
    try {
      this.friendFrame = await this.getFrame('#hangout-landing-chat > iframe');
    } catch (e) {
      if (e instanceof TimeoutError) {
        // eslint-disable-next-line no-console
        console.error(
          'TimeoutError: You may need to sign in; make sure the browser in getPage is set to `headless: false`; also, you may need to open a new tab if you get an insecure browser error.'
        );
      }
      throw e;
    }
  }

  async messageFriend(friend) {
    if (!this.friendFrame) {
      throw new Error('Friend frame does not exist');
    }

    const clickFriend = async () => {
      const selector = `[title="${friend}"]`;
      await this.friendFrame.waitForSelector(selector);
      const elem = await this.friendFrame.$(selector);

      await elem.click();
    };

    // click friend name
    try {
      await clickFriend();
    } catch (e) {
      throw new Error(`Cannot find friend: ${friend}`);
    }

    // not sure, but can't find .editable in iframe[aria-label=${friend}]
    await wait(500);
  }

  async sendMessage(message) {
    await this.page.keyboard.type(message);
    await this.page.keyboard.press('Enter');
  }

  async getFrame(selector) {
    await this.page.waitForSelector(selector);
    let location = await this.page.$eval(selector, (el) =>
      el.getAttribute('src')
    );
    // remove hash from location
    location = location.split('#')[0];

    return this.page.frames().find((f) => f._url === location);
  }
}

module.exports = Hangouts;
