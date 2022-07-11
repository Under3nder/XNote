const { ipcRenderer, contextBridge } = require('electron');
const { File } = require('./file');


contextBridge.exposeInMainWorld('api', {
    newFile: (filePath=null, content='') => new File(filePath, content),
    getFile: (callback) => ipcRenderer.on('get-file', callback),
    setFile: (callback) => ipcRenderer.on('set-file', callback),
});