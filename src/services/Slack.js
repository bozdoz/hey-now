const {
  errors: { TimeoutError },
} = require('puppeteer');
const chalk = require('chalk');
const Service = require('./Service');
const { getConfig, wait, wordCount } = require('../util');

class Slack extends Service {
  async ready() {
    const config = getConfig();
    /** @type {string} */
    let slackUrl = config.slackUrl;

    if (slackUrl && !slackUrl.startsWith('http')) {
      slackUrl = `https://${slackUrl}`;
    }

    if (!slackUrl) {
      throw new Error(
        'Slack URL not provided; use --slack-url=https://your.slack.com or set env: SLACK_URL'
      );
    }

    // get slack url
    await this.page.goto(slackUrl, {
      waitUntil: 'networkidle2',
      timeout: 0,
    });

    // check if login
    try {
      const login = await this.page.$('#email');
      const password = await this.page.$('#password');

      if (login && password) {
        // eslint-disable-next-line no-console
        console.error(
          `${chalk.red(
            'You must login first!'
          )} Set headless to false, and login with your credentials; click Remember me`
        );
        await wait(100000);
      }
    } catch (e) {
      // pass
    }

    try {
      await this.page.waitForSelector('#channel_sidebar_aria_label');
    } catch (e) {
      if (e instanceof TimeoutError) {
        // eslint-disable-next-line no-console
        console.error(
          'TimeoutError: You may need to sign in; make sure the browser in getPage is set to `headless: false`'
        );
      }
      throw e;
    }
  }

  /**
   * Get the textbox ready for a friend's message
   * @param {string} friend
   */
  async messageFriend(friend) {
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
