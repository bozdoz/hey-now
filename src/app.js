const getPage = require('./getPage');
const { wait } = require('./util');

const services = {
  whatsapp: require('./services/WhatsApp'),
  hangouts: require('./services/Hangouts'),
  messenger: require('./services/Messenger'),
  slack: require('./services/Slack'),
};

const MESSAGE = `
Some
🎵...body once told me
The world 🌎 was gonna roll me
I ain't the sharpest tool 🔨 in the sheeeead 🏚
She was looking 👀 kinda dumb 🙆‍♀️
With her finger and her thumb 👌
In the shape ❓
Of an "L" ❗️
On her forehead 🙀
`;

// send each line individually
const messages = MESSAGE.trim()
  .split(/\n/)
  .map((a) => a.trim());

/**
 * @param {string} friend  Name as it appears
 */
const app = async ({ friend, service }) => {
  if (!friend) {
    throw new Error('friend not supplied');
  }

  if (!service) {
    throw new Error(
      `service not supplied: ${Object.keys(services).join(', ')}`
    );
  }

  const Service = services[service];

  if (!Service) {
    throw new Error(
      `service not found: ${service}; options: ${Object.keys(services).join(
        ', '
      )}`
    );
  }

  const page = await getPage();
  const program = new Service(page);

  await program.ready();

  await program.messageFriend(friend);

  for (const message of messages) {
    await program.sendMessage(message);
  }

  // keep up with that tempo
  await wait(1400);
  await program.sendMessage('WELL');

  // wow: gotta wait for the last message to send apparently
  await wait(1000);
};

module.exports = app;
