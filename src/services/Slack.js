const {
  errors: { TimeoutError },
} = require('puppeteer-core');
const chalk = require('chalk');
const Service = require('./Service');
const { wait, wordCount } = require('../util');
const { getConfig } = require('../config');

class Slack extends Service {
  async navigateToURL() {
    let { slackUrl } = getConfig();

    if (slackUrl && !slackUrl.startsWith('http')) {
      slackUrl = `https://${slackUrl}`;
    }

    if (!slackUrl) {
      throw new Error(
        'Slack URL not provided; use --slack-url=https://your.slack.com or set env: SLACK_URL'
      );
    }

    // get slack url
    const page = await this.getPage(slackUrl);

    // check if login
    try {
      const login = await page.$('#email');
      const password = await page.$('#password');

      if (login && password) {
        // eslint-disable-next-line no-console
        console.error(
          `${chalk.red(
            'You must login first!'
          )} Try again with --no-headless, login with your credentials, and click Remember me`
        );
        // TODO use https://www.npmjs.com/package/prompt to ask for username/password
        await wait(100000);
      }
    } catch (e) {
      // pass
    }

    try {
      await page.waitForSelector('#channel_sidebar_aria_label');
    } catch (e) {
      if (e instanceof TimeoutError) {
        // eslint-disable-next-line no-console
        console.error(
          'TimeoutError: You may need to sign in; try again with --no-headless'
        );
      }
      throw e;
    }
  }

  /**
   * Get the textbox ready for a friend's message
   * @param {string} friend
   */
  async findMessageBox(friend) {
    const { page } = this;
    // need to create new message; can't just find name
    await page.click('button[aria-label="New message"]');

    // make sure the user list is visible before typing
    let modal = await page.$('.ReactModal__Content');

    while (!modal) {
      await page.click(
        'input[aria-label="Type the name of a person or channel"]'
      );
      await wait(1000);
      modal = page.$('.ReactModal__Content');
    }

    // put name into search
    await page.keyboard.type(friend);
    // give it time to highlight
    await wait(1000);
    // select friend
    await page.keyboard.press('Enter');

    // test if friend not found
    try {
      await page.$x(`//*[contains(text(), '${friend}')]`);
    } catch (e) {
      throw new Error(`Cannot find friend: ${friend}`);
    }

    // get message box
    await page.click('[contenteditable=true][role=textbox]');
  }

  async sendMessage(message) {
    // slack is really glitchy; adds a lot of delays to try to accommodate
    await this.page.keyboard.type(message, { delay: 10 });
    await wait(20);
    await this.page.keyboard.press('Enter');
    // keep tempo
    await wait(wordCount(message) * 320 + 100);
  }
}

module.exports = Slack;
