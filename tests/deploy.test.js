const deploy = require('../src/deploy');
require('dotenv').config();

//connects to server and lists all existing files in public folder
async function listAll() {
  let config = {
    host: process.env.FTP_HOST,
    port: process.env.FTP_PORT,
    user: process.env.FTP_USER,
    password: process.env.FTP_PASSWORD
  }

  return new Promise((resolve, reject) => {
    const Client = require('ftp');
    const c = new Client();
    const publicFolder = String("/" + process.env.FTP_PUBLIC_FOLDER);

    c.on('ready', function() {
      c.list(publicFolder,function(err, list) {
        if (err) {
          c.end();
          reject(err);
        }else {
          console.dir(list);
          c.end();
          resolve(true);
        }
      });
    });
    c.connect(config);
  });
}

test('connect to ftp server and list files in public folder', async () => {
  await expect(listAll()).resolves.toBe(true);
});