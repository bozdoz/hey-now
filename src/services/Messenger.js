const {
  errors: { TimeoutError },
} = require('puppeteer');
const { wait } = require('../util');
const Service = require('./Service');

class Messenger extends Service {
  async navigateToURL() {
    await this.page.goto('https://messenger.com');
    try {
      await this.page.waitForSelector('[aria-label="Conversations"]');
    } catch (e) {
      if (e instanceof TimeoutError) {
        // eslint-disable-next-line no-console
        console.error(
          'TimeoutError: You may need to login (and click Remember Me); try again with --no-headless'
        );
        // TODO use https://www.npmjs.com/package/prompt to ask for username/password
      }
      throw e;
    }
  }

  async findMessageBox(friend) {
    const waitForAndClick = async (selector) => {
      await this.page.waitForSelector(selector);
      await this.page.click(selector);
    };
    const clickOnFriend = async () =>
      waitForAndClick(`[data-tooltip-content="${friend}"]`);

    const clickMessageBox = async () =>
      waitForAndClick('[aria-label="Type a message..."]');

    try {
      await clickOnFriend();
    } catch (e) {
      throw new Error(`Cannot find friend: ${friend}`);
    }

    // might not need to click message box; but why not?
    await clickMessageBox();

    // just hope it's ready
    await wait(1000);
  }
}

module.exports = Messenger;
