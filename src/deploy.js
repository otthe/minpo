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

async function ensureRemoteDir() {

}


module.exports = {deploy}