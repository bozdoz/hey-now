// mutable store for config
let config = {
  /** --slack-url in cli */
  slackUrl: process.env.SLACK_URL,
  /** --no-headless in cli */
  headless: true,
  /** --firefox in cli */
  firefox: false,
  /** --executable-path in cli */
  executablePath: '',
  /** --debug */
  debug: false,
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
