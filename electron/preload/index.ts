import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  makeRequest: (method: string, args: any[]) => ipcRenderer.send('comm:makeRequest', method, args),
  sendResponse: (failed: boolean, responseTo: string, message: any) => ipcRenderer.send('comm:sendResponse', failed, responseTo, message), 
  onMessageRecieved: (callback: (_: any, msg: any) => void) => ipcRenderer.on('comm:messageRecieved', callback),
  onRequestRecieved: (method: string, callback: (msg: any) => void) => ipcRenderer.on('comm:requestRecieved', (_, data) => {
    const [ msg, rMethod ] = data
    if (rMethod === method) {
      callback(msg)
    }
  }),
  onResponseRecieved: (method: string, callback: (msg: any) => void) => ipcRenderer.on('comm:responseRecieved', (_, data) => {
    const [ msg, rMethod ] = data
    if (rMethod === method) {
      callback(msg)
    }
  }),
})