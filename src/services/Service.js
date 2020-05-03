const { wait, wordCount } = require('../util');

class Service {
  constructor(page) {
    /** @type {import('puppeteer').Page} */
    this.page = page;
  }

  /**
   * Navigate to URL, and make sure we're logged in
   */
  navigateToURL() {
    throw new Error('Method navigateToURL must be implemented');
  }

  /**
   * Prepare text box in order to send message to friend
   */
  findMessageBox() {
    throw new Error('Method findMessageBox must be implemented');
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
