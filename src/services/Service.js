const fs = require('fs');
const path = require('path');
const { wait, wordCount } = require('../util');
const getPage = require('../getPage');
const logger = require('../logger');

const log = logger('Service');

class Service {
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
   * Uses getPage to start a browser instance and navigate to a URL
   */
  async getPage(url) {
    log(`Navigating to ${url}`);
    this.page = await getPage(url);

    await this.page.goto(url);

    return this.page;
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

module.exports = Service;
