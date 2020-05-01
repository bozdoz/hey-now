const getPage = require('./getPage');
const { wait, wordCount } = require('./util');
const WhatsApp = require('./services/WhatsApp');
const Hangouts = require('./services/Hangouts');

const services = {
  whatsapp: WhatsApp,
  hangouts: Hangouts,
};

const MESSAGE = `
Some
🎵...body once told me
The world 🌎 was gonna roll me
I ain't the sharpest tool 🔨 in the sheeeead 🏚
She was looking kinda dumb 🙆‍♀️
With her finger and her thumb 👌
In the shape
Of an "L"
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
    throw new Error('service not supplied: hangouts, whatsapp');
  }

  const page = await getPage();
  const Service = services[service];

  if (!service) {
    throw new Error(`service not found: ${service}`);
  }
  const program = new Service(page);

  await program.ready();

  await program.messageFriend(friend);

  for (const message of messages) {
    await program.sendMessage(message);
    // try to get a good beat, by waiting a certain amount for each word
    await wait(wordCount(message) * 600);
  }

  // keep up with that tempo
  await wait(1200);
  await program.sendMessage('WELL');
};

module.exports = app;
