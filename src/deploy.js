const path = require('path');
const fs = require('fs-extra');
require('dotenv').config();

const localDistFolder = path.join(__dirname, '..', '/dist/');
const remoteDistFolder = String(process.env.FTP_PUBLIC_FOLDER);

const config = {
  host: process.env.FTP_HOST,
  port: process.env.FTP_PORT,
  user: process.env.FTP_USER,
  password: process.env.FTP_PASSWORD
}

async function deploy() {
  console.log("DEPLOYING VIA FTP!");
  console.log(localDistFolder);
  console.log(remoteDistFolder);

  console.log(config);

  const Client = require('ftp');
  let client = new Client();

  await client.on('ready', async function(){
    try {
      await ensureRemoteDir(client, remoteDistFolder); // which one should be called first?
      await clearRemoteDir(client, remoteDistFolder);
      await uploadToRemoteDir(client, localDistFolder, remoteDistFolder);
    } catch (error) {
      console.log('something went wrong', error);
    } finally {
      client.end();
    }
  }); 
  client.connect(config);
}

async function ensureRemoteDir(client, remoteDir) {
  return new Promise((resolve, reject) => {
    client.mkdir(remoteDir, true, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

async function clearRemoteDir(client, remoteDir, baseDir) {
  
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

async function uploadToRemoteDir() {

}

module.exports = {deploy}