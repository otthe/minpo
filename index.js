const path = require('path');
const fs = require('fs-extra');
require('dotenv').config();
const {program} = require('commander');

const jsonPath = path.join(__dirname, '/site/site.json');
const localDistFolder = path.join(__dirname/*, '..'*/, '/dist/');

console.log(jsonPath);
console.log(localDistFolder);
function backup() {
  console.log("CREATING A BACKUP!");
}
function generate() {
  console.log("SITE GENERATED!");
}
function deploy() {
  console.log("DEPLOYING VIA FTP!");
}

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