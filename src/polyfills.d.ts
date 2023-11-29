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
    onTimeout: (callback: () => void) => void,
    onRequestRecieved: (method, callback: (msg: request, respond: (failed: boolean, message: any) => void) => void) => void
    onResponseRecieved: (method, callback: (msg: response) => void) => void
  }
}