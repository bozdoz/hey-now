const {
  errors: { TimeoutError },
} = require('puppeteer');
const Service = require('./Service');
const { wait } = require('../util');

class Hangouts extends Service {
  async navigateToURL() {
    await this.page.goto('https://hangouts.google.com');
    try {
      this.friendFrame = await this.getFrame('#hangout-landing-chat > iframe');
    } catch (e) {
      if (e instanceof TimeoutError) {
        // eslint-disable-next-line no-console
        console.error(
          'TimeoutError: You may need to sign in; try again with --no-headless; also, you may need to open a new tab if you get an insecure browser error.'
        );
        // TODO use https://www.npmjs.com/package/prompt to ask for username/password
      }
      throw e;
    }
  }

  async findMessageBox(friend) {
    if (!this.friendFrame) {
      throw new Error('Friend frame does not exist');
    }

    const clickFriend = async () => {
      const selector = `[title="${friend}"]`;
      await this.friendFrame.waitForSelector(selector);
      await this.friendFrame.click(selector);
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
