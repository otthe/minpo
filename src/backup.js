const path = require('path');
const fs = require('fs-extra');

async function backup() {
  console.log("CREATING A BACKUP!");
  console.log(generateTimestamp());

  const jsonPath = path.join(__dirname, '..', '/site/', 'site.json');
  
  const distFolder = path.join(__dirname, '..', '/dist/');
  const distExists = fs.existsSync(distFolder);

  const backupFolder = path.join(__dirname, '..', '/backup/');

  if (!distExists) {
    console.log('could not find dist folder to backup');
    process.exit(1);
  } 

  confirmBackupExistence(backupFolder);

  await createBackup(distFolder, backupFolder, jsonPath);

}

function generateTimestamp(){
  const d = new Date();
  const day = d.getDate();
  const month = 1 + d.getMonth(); //zerobased so we add one to it
  const year = d.getFullYear();
  const hour = d.getHours();
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();

  const timestamp = `${year}-${month}-${day}-${hour}-${minutes}-${seconds}`;
  return timestamp;
}

function confirmBackupExistence(backupFolder) {
  const backupFolderExists = fs.existsSync(backupFolder);
  if (!backupFolderExists) {
    try {
      fs.mkdirSync('./backup/');
    } catch (err) {
      console.log('error creating backup folder: ', err);
    }
  }
}

async function createBackup(distFolder, backupFolder, jsonPath) {
  const timestamp = generateTimestamp();
  await fs.mkdir(`./backup/${timestamp}`);
}

module.exports = {backup}