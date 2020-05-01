#!/usr/bin/env node
const meow = require('meow');
const app = require('./app');

const cli = meow(`
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

app({
  service,
  friend,
  // eslint-disable-next-line no-console
}).catch((e) => console.error(e) || cli.showHelp(0));
