const path = require('path');
const fs = require('fs-extra');
require('dotenv').config();
const {program} = require('commander');

const {backup} = require('./src/backup');
const {deploy} = require('./src/deploy');
const {generate} = require('./src/generate');

const jsonPath = path.join(__dirname, '/site/site.json');
const localDistFolder = path.join(__dirname/*, '..'*/, '/dist/');

console.log(jsonPath);
console.log(localDistFolder);

program
  .option('-b, --backup', 'Backup the dist folder')
  .option('-g, --generate', 'Generate the site to dist folder')
  .option('-d, --deploy', 'Deploy the content of dist folder via FTP')
  .parse(process.argv);

// We want to process the option arguments in a same order as user has inserted them
// this makes the application more flexible in case we add additional features in the future.
const optionsOrder = process.argv.filter(arg => ['-b', '--backup', '-g', '--generate', '-d', '--deploy'].includes(arg));
const options = program.opts();

const actionsMap = {
  '-b': backup,
  '--backup': backup,
  '-g': generate,
  '--generate': generate,
  '-d': deploy,
  '--deploy': deploy
};

optionsOrder.forEach(option => {
  if (actionsMap[option]) {
    actionsMap[option]();
  }
});

function optionInstructions(program) {
  for (let i = 0; i < program.options.length; i++) {
    const opt = program.options[i];
    console.log(opt.flags);
    console.log(opt.description);
  }
}

//console.log(process.argv.length);

if (process.argv.length === 2) {
  console.error('Error! No arguments provided !!!');
  optionInstructions(program);
  process.exit(1);
}