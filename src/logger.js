const chalk = require('chalk');
const { getConfig } = require('./config');

/**
 * debug console messages
 * @param {string} name
 * @returns {(x: any[]) => void}
 */
const logger = (name) => (...args) => {
  const { debug } = getConfig();

  if (debug) {
    // eslint-disable-next-line no-console
    console.log(chalk.green(`[${name}]`), ...args);
  }
};

module.exports = logger;
