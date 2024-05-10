require('dotenv').config();
const {program} = require('commander');
const colors = require('colors');

const {backup} = require('./src/backup');
const {deploy} = require('./src/deploy');
const {generate} = require('./src/generate');

program
  .option('-b, --backup', 'Backup the dist folder')
  .option('-g, --generate', 'Generate the site to dist folder')
  .option('-d, --deploy', 'Deploy the content of dist folder via FTP')
  .option('-h, --help', 'Lists all the available option arguments')
  .parse(process.argv);

// We want to process the option arguments in the same order as user has inserted them
// this makes the application more flexible in case we add additional features in the future.
const optionsOrder = process.argv.filter(arg => ['-b', '--backup', '-g', '--generate', '-d', '--deploy', '-h', '--help'].includes(arg));

const actionsMap = {
  '-b': backup,
  '--backup': backup,
  '-g': generate,
  '--generate': generate,
  '-d': deploy,
  '--deploy': deploy,
  '-h': () => optionInstructions(program),
  '--help': () => optionInstructions(program),
};

function optionInstructions(program) {
  if (program.options.length === 0) return;
  console.log("|-------------------------|");
  console.log("|List of option arguments:|");
  console.log("|-------------------------|");

  program.options.forEach((opt) => {
    console.log(`${opt.flags.brightBlue} = ${opt.description}`);
  });
}

// Safety function to make sure that each action is executed in correct order
// despite it being asynchronous or not
async function executeInOrder() {
  for (const opt of optionsOrder) {
    if (actionsMap[opt]) {
      await actionsMap[opt]();
    }
  }
}

if (process.argv.length === 2) {
  console.error('Error! No arguments provided !!!'.red);
  optionInstructions(program);
  process.exit(1);
} else {
  executeInOrder().catch(error => {
    console.error(`Execution error: ${error.message}`.red);
    process.exit(1);
  });
}