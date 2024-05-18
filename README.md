# Minpo
Static site generator for personal websites with automatic FTP deploy

## Minpo has:
- One click FTP deployment
- One file data management
- One click page status management
- Backup files
- File packing for optimization

## Instructions:
- All data is stored in site.json
- Each page should have view named 'pagename.ejs' in views folder
- Each subpage should have view named 'pagename_subpage.ejs' in views folder
- You can refer page specific data by using page.page_data_field or subpage.page_data_field

## Commands
- -g || --generate to generate html files
- -d || --deploy to deploy files to FTP server
- -b || --backup to copy site.json and contents of dist
- If you chain multiple commands, they will be executed in call order

## .env
- Create .env file to the root directory with following fields
```bash
FTP_HOST = ""
FTP_PORT = 21
FTP_USER = ""
FTP_PASSWORD = ""
FTP_PUBLIC_FOLDER = "/public_folder/" # use slashes
LOCALHOST = "true"
``````

## Folder structure:
<!-- TREEVIEW START -->
```bash
├── backup/
│   └── 2024-5-17-0-44-8/
│       ├── blog/
│       ├── contact/
├── dist/
│   ├── blog/
│   ├── contact/
├── site/
│   ├── images/
│   ├── layouts/
│   ├── partials/
│   └── views/
├── src/
└── tests/
```
<!-- TREEVIEW END -->
