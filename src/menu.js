const { Menu, MenuItem, app, ipcMain, dialog } = require('electron');
const fs = require('fs');
const { File } = require('./file');

const SAVE = 0;
const DISCARD = 1;
const CANCEL = 2;

let mainWindow;

const isMac = process.platform === 'darwin'
const template = [
  // { role: 'editMenu' }
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(isMac ? [
        { role: 'pasteAndMatchStyle' },
        { role: 'delete' },
        { role: 'selectAll' },
        { type: 'separator' },
        {
          label: 'Speech',
          submenu: [
            { role: 'startSpeaking' },
            { role: 'stopSpeaking' }
          ]
        }
      ] : [
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
      ])
    ]
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  // { role: 'windowMenu' }
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      ...(isMac ? [
        { type: 'separator' },
        { role: 'front' },
        { type: 'separator' },
        { role: 'window' }
      ] : [
        { role: 'close' }
      ])
    ]
  },
]
const menu = Menu.buildFromTemplate(template);

// File MenuItem
const file = new MenuItem({
  label: 'File',
  submenu: [
    { label: 'New', accelerator: 'CmdOrCtrl+N', click: () => { mainWindow.webContents.send('get-file', 'new-file') } },
    { label: 'Open', accelerator: 'CmdOrCtrl+O', click: () => { mainWindow.webContents.send('get-file', 'open-file') } },
    { label: 'Save', accelerator: 'CmdOrCtrl+S', click: () => { mainWindow.webContents.send('get-file', 'save-file') } },
    { label: 'Save As', accelerator: 'CmdOrCtrl+Shift+S', click: () => { mainWindow.webContents.send('get-file', 'save-file-as') } },
    isMac ? { label: 'Quit', accelerator: 'CmdOrCtrl+Q', click: app.quit } :
      { label: 'Close', accelerator: 'CmdOrCtrl+W', click: app.quit }
  ]
});
menu.insert(0, file);

/****************************************************************
 * File interaction functions
 */
ipcMain.on('new-file', (event, file) => {
  // prompt to save the file if it has been modified before creating a new file
  promptToSave(file, newFile);
});

ipcMain.on('open-file', (event, file) => {
  // prompt to save the file if it has been modified before opening another file
  promptToSave(file, openFile);
});

ipcMain.on('save-file', (event, file) => {
  if (file.filePath === null) {  // if file has never been saved
    saveFileAs(file);
  } else {
    saveFile(file);
  }
});

ipcMain.on('save-file-as', (event, file) => {
  saveFileAs(file);
});

/****************************************************************
 * Menu functions
 */
function promptToSave(file, action) {
  if (file.modified) {
    // prompt to save the file if it has been modified
    dialog.showMessageBox(mainWindow, {
      type: 'question',
      buttons: ['Save', 'Discard', 'Cancel'],
      defaultId: 0,
      cancelId: 2,
      noLink: true,
      title: 'Save File',
      message: 'You have some unsaved changes. Do you want to save the file?'
    }).then(response => {
      switch (response.response) {
        case SAVE:  // save file and perform action
          saveFile(file);
        case DISCARD:  // perform action
          action();
        case CANCEL:  // do nothing
      }
    });
  } else {
    // if not modified just perform the action
    action();
  }
}

function newFile() {
  mainWindow.webContents.send('set-file', new File());
}

function openFile() {
  // open file dialog
  dialog.showOpenDialog(mainWindow, {
    title: 'Open File',
    properties: ['openFile'],
    filters: [
      { name: 'Text files', extensions: ['txt'] },
      { name: 'All Files', extensions: ['*'] },
    ]
  }).then(response => {
    if (response.canceled) {
      return;
    }
    // read file
    fs.readFile(response.filePaths[0], 'utf8', (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      // set file
      mainWindow.webContents.send('set-file', new File(response.filePaths[0], data));
    });
  });
}

function saveFile(file) {
  fs.writeFile(file.filePath, file.content, (err) => {
    if (err) {
      console.log(err);
    } else {
      // update file
      file.modified = false;
      mainWindow.webContents.send('set-file', file);
    }
  });
}

function saveFileAs(file) {
  // save file dialog
  dialog.showSaveDialog(mainWindow, {
    title: 'Save File',
    defaultPath: '',
    filters: [
      { name: 'Text Files', extensions: ['txt'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  }).then(response => {
    if (response.filePath) {
      // update file path and save the file
      file.filePath = response.filePath;
      saveFile(file);
    }
  });
}

// Exports
exports.myMenu = (window) => {
  mainWindow = window;
  return menu;
};
