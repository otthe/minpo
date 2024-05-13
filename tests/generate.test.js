const {generate, confirmViewExistence, setBaseUrl} = require('../src/generate');
const path = require('path');
const fs = require('fs-extra');
require('dotenv').config();

// location and existence might not need to be run elsewhere since they are used on same folder level everywhere
test('find template', () => {
  const template = path.join(__dirname, '..', '/site/', 'template.ejs');
  const templateExists = fs.existsSync(template);
  expect(templateExists).toBe(true);
});

test('regex function test', () => {
  const regex = /test/;
  const result = regex.exec("test string");
  expect(result[0]).toBe("test");
});

test('dist folder exists', () => {
  const dist = path.join(__dirname, '..', '/dist/');
  const distExists = fs.existsSync(dist);
  expect(distExists).toBe(true);
});

test('img folder exists', () => {
  const imgs = path.join(__dirname, '..', '/site/images/');
  const imgsExists = fs.existsSync(imgs);
  expect(imgsExists).toBe(true);
});

test('layouts folder exists', () => {
  const layouts = path.join(__dirname, '..', '/site/layouts/');
  const layoutsExists = fs.existsSync(layouts);
  expect(layoutsExists).toBe(true);
});

test('site.json can be found and opened, pages are defined', () => {
  const jsonPath = path.join(__dirname, '..', '/site/', 'site.json');
  const jsonExists = fs.existsSync(jsonPath);
  expect(jsonExists).toBe(true);

  const json = fs.readJsonSync(jsonPath);

  expect(json).toBeDefined();

  const pages = json.pages;
  expect(pages).toBeDefined();
});

test('site.json has pages; pages and possible subpages have "active" boolean', () => {
  const jsonPath = path.join(__dirname, '..', '/site/', 'site.json');
  const json = fs.readJsonSync(jsonPath);

  const pages = json.pages;
  
  Object.keys(pages).forEach(function(key) {
    expect(pages[key].active).toBeDefined();
    expect(typeof pages[key].active).toBe("boolean");

    expect(key.length).toBeGreaterThan(0);

    //if subpages exists, go through them and make sure active variable is found
    if (pages[key].subpages && pages[key].subpages.length > 0) {
      const subpages = pages[key].subpages;

      Object.keys(subpages).forEach(function(sb) {
        expect(subpages[sb]).toBeDefined();
        expect(subpages[sb].active).toBeDefined();
        expect(typeof subpages[sb].active).toBe("boolean");
      })
    }
  });
});

test('there should be view for every page and subpage defined in the site.json', () => {
  const jsonPath = path.join(__dirname, '..', '/site/', 'site.json');
  const json = fs.readJsonSync(jsonPath);
  const pages = json.pages;

  // pages
  Object.keys(pages).forEach(function(key) {
    const view = path.join(__dirname, '..', '/site/views/', `${key}.ejs`);
    const viewExists = fs.existsSync(view);
    expect(viewExists).toBe(true);

    //subpages
    if (pages[key].subpages && Array.isArray(pages[key].subpages)) {
      //we just check if "key_subpage" view is defined if not, we create it
      const subpageView = path.join(__dirname, '..', '/site/views/', `${key}_subpage.ejs`);
      const subpageViewExists = fs.existsSync(subpageView);
      expect(subpageViewExists).toBe(true);
    }

  });

});

// test('confirmViewExistence should create all the missing views',async () => {
//   expect( await confirmViewExistence() ).toBeDefined();
// });