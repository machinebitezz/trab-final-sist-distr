declare interface Window {
  electron: {
    makeRequest: (method: string, payload: any[]) => void,
    onMessageRecieved: (callback: (_: any, msg: {failed: boolean, message: any}) => void) => void
  }
}