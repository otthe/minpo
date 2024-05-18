const path = require('path');
const fs = require('fs-extra');
require('dotenv').config();

const localDistFolder = path.join(__dirname, '..', '/dist/');
const remoteDistFolder = process.env.FTP_PUBLIC_FOLDER

const config = {
  host: process.env.FTP_HOST,
  port: process.env.FTP_PORT,
  user: process.env.FTP_USER,
  password: process.env.FTP_PASSWORD
}

/**
 * Deploy the content of dist folder to FTP server
 */
async function deploy() {
  console.log("DEPLOYING VIA FTP!");
  console.log(localDistFolder);
  console.log(remoteDistFolder);

  console.log(config);

  const Client = require('ftp');
  let client = new Client();

  await client.on('ready', async function(){
    try {
      await clearRemoteDir(client, remoteDistFolder);
      await ensureRemoteDir(client, remoteDistFolder);
      await uploadToRemoteDir(client, localDistFolder, remoteDistFolder);
    } catch (error) {
      console.log('something went wrong', error);
    } finally {
      client.end();
    }
  }); 
  client.connect(config);
}

/**
 * Ensures the existence of remote dir, if it doesn't exist create one
 * @param {*} client FTP client 
 * @param {*} remoteDir Path to remote dir
 * @returns 
 */
async function ensureRemoteDir(client, remoteDir) {
  return new Promise((resolve, reject) => {
    client.mkdir(remoteDir, true, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

/**
 * Recursively checks for files on public folder on FTP server and deletes them
 * @param {*} client FTP client
 * @param {*} remoteDir Public folder on FTP server
 * @param {*} baseDir Name of public folder
 * @returns 
 */
async function clearRemoteDir(client, remoteDir, baseDir=process.env.FTP_PUBLIC_FOLDER) {
  
  if (!remoteDir.startsWith(baseDir)) {
    console.log(`Attempt to access outside of base directory: ${remoteDir}`);
    return Promise.resolve();
  }
  console.log(`checking directory: ${remoteDir}`);

  return new Promise((resolve, reject) => {
    client.list(remoteDir, (err, list) => {
      if (err){
        console.log(`Error listing directory ${remoteDir}: ${err.message}`);
        if (err.code === 550) {
          console.log(`Directory ${remoteDir} not found.`);
          resolve();
          return;
        }
        reject(err);
        return;
      }

      let total = list.length;
      console.log(`found ${total} items in ${remoteDir}`);
      if (total === 0) {
        resolve();
        return;
      }

      list.forEach(async (item) => {
        const remotePath = path.join(remoteDir, item.name);
        console.log(`processing ${item.type === 'd' ? 'directory' : 'file'}: ${remotePath}`); 

        if (item.type === 'd') {
          await clearRemoteDir(client, remotePath, baseDir); //recursive call
          client.rmdir(remotePath, true, (err) => {
            if (err) {
              console.log(`failed to remove dir ${remotePath}: ${err.message}`);
              reject(err);
              return;
            }

            if (--total === 0) resolve();

          });
        } else {
          client.delete(remotePath, (err) => {
            if (err) {
              console.log(`faoöed to delete file ${remotePath}: ${err.message}`);
              reject(err);
              return;
            }
            if (--total === 0) resolve();
          });
        }
      });
    });
  });
}

/**
 * Check the type of files in local dist folder and upload them one by one to FTP
 * @param {*} client FTP client 
 * @param {*} localDir Local dist folder
 * @param {*} remoteDir FTP dist folder
 */
async function uploadToRemoteDir(client, localDir, remoteDir) {
  const files = fs.readdirSync(localDir);
  for (const file of files) {
    const localFilePath = path.join(localDir, file);
    const remoteFilePath = path.join(remoteDir, file);
    const stats = fs.statSync(localFilePath);

    if (stats.isFile()){
      await uploadFile(client, localFilePath, remoteFilePath);
    } else if (stats.isDirectory()) {
      await ensureRemoteDir(client, remoteFilePath);
      await uploadToRemoteDir(client, localFilePath, remoteFilePath);
    }
  }
}

/**
 * Upload individual file to FTP
 * @param {*} client FTP client
 * @param {*} localFilePath Path to local file
 * @param {*} remoteFilePath Path to deployed file
 * @returns 
 */
async function uploadFile(client, localFilePath, remoteFilePath) {
  return new Promise((resolve, reject) => {
    client.put(localFilePath, remoteFilePath, (err) => {
      if (err) {
        console.log(`failed to upload ${localFilePath} ${err}`);
        reject(err);
      }else {
        console.log(`uploaded ${localFilePath} to ${remoteFilePath}`);
        resolve();
      }
    });
  });
}



module.exports = {deploy}