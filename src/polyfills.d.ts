declare interface request {
  type: 'REQUEST',
  payload: {
    method: string
    args: any[]
  }
}

declare interface response {
  type: 'RESPONSE',
  payload: {
    failed: boolean
    responseTo: string
    message: any
  }
}

declare interface Window {
  electron: {
    makeRequest: (method: string, args: any[]) => void,
    sendResponse: (failed: boolean, responseTo: string, message: any) => void,
    onRequestRecieved: (method, callback: (msg: request) => void) => void
    onResponseRecieved: (method, callback: (msg: response) => void) => void
  }
}