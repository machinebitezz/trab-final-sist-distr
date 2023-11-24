import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  makeRequest: (method: string, args: any[]) => ipcRenderer.send('comm:makeRequest', method, args),
  onMessageRecieved: (callback: (_: any, msg: {failed: boolean, message: any}) => void) => ipcRenderer.on('comm:messageRecieved', callback)
})