const path = require('path');
const fs = require('fs-extra');
const ejs = require('ejs');
const minify = require('html-minifier').minify;
require('dotenv').config();

const jsonPath = path.join(__dirname, '..', '/site/', 'site.json');
const templatePath = path.join(__dirname, '..', '/site/', 'template.ejs');
const localDistFolder = path.join(__dirname, '..', '/dist/');

console.log(localDistFolder);

const minifyConfig = {
  includeAutoGeneratedTags: true,
  removeAttributeQuotes: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  sortClassName: true,
  useShortDoctype: true,
  collapseWhitespace: true,
  minifyCSS: true
}

function setBaseUrl(location, devMode) {
  let route = "/";
  
  //this is just because when u use apache/nginx server locally, usually the project is in the subfolder var/www/html/project

  //.env treats this variable as string so this is kind of hacky solution, might come back to this later
  if (devMode === "true") {
    if (location.startsWith("/")) {
      route = location;
    } else {
      route = "/" + location;
    } 
  } else if (devMode === "false") {
    route = "/";
  } else {
    throw Error("process.env.LOCALHOST should be true or false!");
  }

  return route;
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
        siteData.base_url = setBaseUrl(process.env.FTP_PUBLIC_FOLDER, process.env.LOCALHOST);

        // how to make the shortage available to "page[key]"".ejs??
        renderPage(key, siteData, localDistFolder);
      }
  }

}

function renderPage(key, data, localDistFolder) {
  ejs.renderFile(templatePath, data, {}, function(error, html) {
    if (error) {
      console.error(`error rendering ${key} page: `, error);
      return;
    }
    //minify html
    html = minify(html, minifyConfig);
    fs.writeFileSync(`${localDistFolder}${key}.html`, html);
  });
}

module.exports = {generate, setBaseUrl}