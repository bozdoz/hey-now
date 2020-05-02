// mutable store for config
let config = {
  /** --slack-url in the cli */
  slackUrl: process.env.SLACK_URL,
  /** --no-headless in cli */
  headless: true,
};
const getConfig = () => config;

const setConfig = (obj) => {
  config = {
    ...config,
    ...obj,
  };
};

module.exports = {
  getConfig,
  setConfig,
};
