const { contextBridge, ipcRenderer, dialog, } = require('electron')

contextBridge.exposeInMainWorld('utils', {
  'select-file': () => ipcRenderer.invoke('select-file'),
  closeAll: () => ipcRenderer.send('close-all'),
  closeAllAndReturn: () => ipcRenderer.send('close-all-return'),
  dropImage: (path) => ipcRenderer.send('drop-image', path),
})