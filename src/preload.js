const { ipcRenderer, contextBridge } = require('electron');


contextBridge.exposeInMainWorld('api', {
    getFile: (callback) => ipcRenderer.on('get-file', callback),
    setFile: (callback) => ipcRenderer.on('set-file', callback),
});