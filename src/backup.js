const path = require('path');
const fs = require('fs-extra');

/**
 * Creates a timestamped backup of the contents of dist folder and site.json
 */
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

/**
 * Generates timestamp for the backup folder name
 * @returns timestamp (Y-M-D-H-M-S)
 */
function generateTimestamp(){
  const d = new Date();
  const day = d.getDate();
  const month = 1 + d.getMonth(); //zero-based so we add one to it
  const year = d.getFullYear();
  const hour = d.getHours();
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();

  const timestamp = `${year}-${month}-${day}-${hour}-${minutes}-${seconds}`;
  return timestamp;
}

/**
 * Checks the existence of backup folder, if it doesn't exist create one
 * @param {*} backupFolder Location of backup folder 
 */
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

/**
 * Copies the files from dist folder to new timestamped folder inside backup folder
 * @param {*} distFolder Location of dist folder
 * @param {*} backupFolder Location of backup folder
 * @param {*} jsonPath Path to site.json file 
 */
async function createBackup(distFolder, backupFolder, jsonPath) {
  const timestamp = generateTimestamp();

  const options = {
   overwrite: true,
   filter: src => !src.includes('.tmp')
  };

  await fs.mkdir(`./backup/${timestamp}`);

  console.log(backupFolder);

  //backup the files from dist folder
  await fs.copy(distFolder, `${backupFolder}${timestamp}`, options, (err) => {
    if (err) {
      return console.log('error occurred while copying files: ', err);
    }
  });

  //backup the site.json from site fodler
  await fs.copyFile(jsonPath, `${backupFolder}${timestamp}/site.json`, (err) => {
    if (err) {
      return console.log('error occurred while copying files: ', err);
    }
  });

  console.log("backup created!");

}

module.exports = {backup}