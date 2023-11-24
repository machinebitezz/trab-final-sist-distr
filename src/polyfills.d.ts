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
    message: string
  }
}

declare interface Window {
  electron: {
    makeRequest: (method: string, payload: any[]) => void,
    onMessageRecieved: (callback: (_: any, msg: request | response) => void) => void
  }
}