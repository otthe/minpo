const path = require('path');
const fs = require('fs-extra');
const ejs = require('ejs');
const minify = require('html-minifier').minify;


function generate() {
  console.log("SITE GENERATED!");

  const jsonPath = path.join(__dirname,'..', '/site/site.json');
  const distFolder = path.join(__dirname, '..', '/dist/');

  console.log(jsonPath);
  console.log(distFolder);
}

module.exports = {generate}