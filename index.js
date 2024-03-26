const { app, BrowserWindow, ipcMain, dialog, } = require('electron/main')
const path = require('node:path')


/** @type {BrowserWindow} */
let win

/** @type {BrowserWindow[]} */
let subs = []

function createMainWindow() {
  win = new BrowserWindow({
    width: 400,
    height: 400,
    webPreferences: {
      preload: path.join(__dirname, 'main-process/preload.js'),
      nodeIntegration: true,
    },
    icon: path.join(__dirname, 'assets/mian-liao.png'),
  })
  if (!app.isPackaged) {
    win.loadURL('http://localhost:3300')
  } else {
    win.loadFile('dist/index.html')
  }
  return win
}

/**
 * 
 * @param {string} path 
 */
function createSubWindowByFilePath(_path) {
  console.log(_path)
  const preloadPath = path.join(__dirname, 'sub-process/preload.js')
  console.log(preloadPath)
  const newWin = new BrowserWindow({
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: true,
    },
    height: 300,
    icon: path.join(__dirname, 'assets/mian-liao.png'),
  })
  if (!app.isPackaged) {
    newWin.loadURL('http://localhost:3300/sub/')
  } else {
    newWin.loadFile('dist/sub/index.html')
  }
  subs.push(newWin)
  newWin.webContents.on('did-finish-load', () => {
    newWin.webContents.send('watch-file', _path)
    console.log(newWin.id)
  })
}

app.whenReady().then(() => {
  ipcMain.handle('select-file', async () => {
    return new Promise((rs, rj) => {
      dialog.showOpenDialog(win, {
        properties: ['openFile'],
      }).then(result => {
        if (!result.canceled && result.filePaths.length > 0) {
          const selectedFilePath = result.filePaths[0]
          console.log(selectedFilePath)
          createSubWindowByFilePath(selectedFilePath)
          rs(selectedFilePath)
        } else {
          rj()
        }
      })
    })
  })
  ipcMain.on('quit-sub', (event) => {
    const targetWin = BrowserWindow.fromWebContents(event.sender)
    if (targetWin) {
      targetWin.webContents.emit('stop-watch')
      targetWin.close()
      const idx = subs.indexOf(targetWin)
      idx !== -1 && subs.splice(idx, 1)
    }
  })
  ipcMain.on('close-all', clearAllSubs)
  ipcMain.once('close-all-return', () => {
    // clearAllSubs()
    win.close()
    app.quit()
  })
  ipcMain.on('drop-image', (_, path) => createSubWindowByFilePath(path))
  createMainWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) app.quit()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

/**
 * 清空所有子窗口并关闭，然后清空子窗口数组
 */
function clearAllSubs() {
  if (subs.length) subs.forEach(sub => {
    sub.emit('stop-watch')
    sub.close()
  })
  subs.splice(0)
}
app.on('before-quit', () => {
  clearAllSubs()
  if (win.closable()) win.close()
})