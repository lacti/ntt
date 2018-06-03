/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
const electron = require('electron');
const asar = require('asar');
const path = require('path');
const url = require('url');

const { app, BrowserWindow } = electron;

let mainWindow;

const createWindow = () => {
  const archivePath = path.join(__dirname, 'app.asar');
  console.log(asar.listPackage(archivePath));

  mainWindow = new BrowserWindow({ width: 1024, height: 768 });

  electron.protocol.interceptBufferProtocol('file', (req, callback) => {
    const filePathMaybe = url.parse(req.url).path;
    const isWindows = /file:\/\/\/[A-Z]+:/.test(req.url);
    const filePath = !isWindows
      ? filePathMaybe.substr(1) // remove '/'
      : filePathMaybe.substr(filePathMaybe.indexOf(':') + 2).replace('/', '\\'); // remove 'C:/'

    const buffer = asar.extractFile(archivePath, filePath);
    callback(buffer);
  });

  mainWindow.setMenu(null);
  mainWindow.loadFile('/index.html');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // For OS X
  if (mainWindow === null) {
    createWindow();
  }
});
