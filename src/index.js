#!/usr/bin/env node
const meow = require('meow');
const chalk = require('chalk');
const app = require('./app');
const { setConfig } = require('./config');

const cli = meow(`${chalk.black.bgGreenBright(' HEY NOW ')}

  Usage
    $ npm start <service> "<friend>"

  Input
    service   
      whatsapp | hangouts
    
    friend    
      case-sensitive name of friend as it appears on your chosen service

  Examples
    $ npm start whatsapp "Dakota Childd"
`);

if (cli.input.length !== 2) {
  // exit(0)
  cli.showHelp(0);
}

const [service, friend] = cli.input;

setConfig(cli.flags);

// TODO conditionally exit process
app({
  service,
  friend,
})
  .then(() => process.exit(0))
  // eslint-disable-next-line no-console
  .catch((e) => console.error(chalk.red(e.message)) || process.exit(0));
