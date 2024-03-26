const { contextBridge, ipcRenderer, clipboard, } = require('electron')
const chokidar = require('chokidar')
const fs = require('fs')
const WebSocket = require('ws')
const { getPort } = require('get-port-please')

/** @type {chokidar.FSWatcher} */
let watcher

/** @type {number} */
let port
/**
 * @type {WebSocket.Server}
 */
let wss

/** @type {WebSocket} */
let ws
// const wss = new WebSocket.Server({ port: await getPort() })
/**
 * 
 * @param {string} path 
 */
async function watchFile(path) {
  if (!watcher) watcher = chokidar.watch(path, {
    persistent: true,
  }).on('ready', () => {
    ipcRenderer.emit('watch-path', path)
  }).on('change', path => {

    console.log(`File ${path} has been changed`)

    if (ws) {
      fs.readFile(path, (err, data) => {
        console.log(err)
        console.log(data)
        ws.send(data, { binary: true, }, err => {
          if (err) console.error('传输失败')
          else console.log('传输图片成功')
        })
      })
    }
  })
  console.log(watcher)
}
ipcRenderer.once('watch-file', (_, path) => watchFile(path))
ipcRenderer.once('stop-watch', () => {
  if (watcher) watcher.close()
  if (wss) wss.close()
})

contextBridge.exposeInMainWorld('bridge', {
  // 建立websocket成功的回调
  onRegistratWS: callback => ipcRenderer.on('registrat-ws', callback),
  quit: () => ipcRenderer.send('quit-sub'),
  async startGetPort() {
    if (!port) port = await getPort()
    console.log(port)
    if (!wss) {
      wss = new WebSocket.Server({ port, })
      wss.on('connection', _ws => {
        ipcRenderer.emit('registrat-ws')
        ws = _ws
      })
    }
    return port
  },
  onWatchFileByPath: callback => ipcRenderer.once('watch-path', callback),
  copyText: text => clipboard.writeText(`${text}`),
})