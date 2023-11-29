import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  makeRequest: (method: string, args: any[]) => ipcRenderer.send('comm:makeRequest', method, args),
  sendResponse: (failed: boolean, responseTo: string, message: any) => ipcRenderer.send('comm:sendResponse', failed, responseTo, message), 
  onTimeout: (callback: () => void) => ipcRenderer.on('internal:timeout', callback),
  onRequestRecieved: (method: string, callback: (msg: any, respond: (failed: boolean, message: any) => void) => void) => ipcRenderer.on('comm:requestRecieved', (_, data) => {
    function sendResponse(failed: boolean, message: any) {
      ipcRenderer.send('comm:sendResponse', failed, idMethod, message)
    }

    const [ msg, idMethod ] = data

    const [ timestamp, rMethod ] = idMethod.split('\\')

    if (rMethod === method) {
      callback(msg, sendResponse)
    }
  }),
  onResponseRecieved: (method: string, callback: (msg: any) => void) => ipcRenderer.on('comm:responseRecieved', (_, data) => {
    const [ msg, rMethod ] = data
    if (rMethod === method) {
      callback(msg)
    }
  }),
})