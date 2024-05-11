const path = require('path');
const fs = require('fs-extra');
const ejs = require('ejs');
const minify = require('html-minifier').minify;

const jsonPath = path.join(__dirname, '..', '/site/', 'site.json');
const localDistFolder = path.join(__dirname, '..', '/dist/');

function setBaseUrl() {

}

async function generate() {
  const siteData = fs.readJsonSync(jsonPath);
  const pages = siteData.pages;

  await iteratePages(siteData, pages);
}

async function iteratePages(siteData, pages) {
  for (const [key, page] of Object.entries(pages)) {
    if (page.active) {
        siteData.rendering = key;

        // how to make the shortage available to "page[key]"".ejs??
        renderPage();
      }
  }

}

function renderPage(key, data, localDistFolder) {
  ejs.renderFile()
}

module.exports = {generate, setBaseUrl}