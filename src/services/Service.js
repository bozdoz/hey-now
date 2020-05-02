const { wait, wordCount } = require('../util');

class Service {
  constructor(page) {
    /** @type {import('puppeteer').Page} */
    this.page = page;
  }

  ready() {
    throw new Error('Method ready must be implemented');
  }

  /**
   * Prepare text box in order to send message to friend
   */
  messageFriend() {
    throw new Error('Method messageFriend must be implemented');
  }

  /**
   * Sends message and keeps tempo
   * @param {string} message
   */
  async sendMessage(message) {
    await this.page.keyboard.type(message);
    await this.page.keyboard.press('Enter');
    await wait(wordCount(message) * 600);
  }
}

module.exports = Service;
