export type ship = 'carrier' | 'battleship' | 'cruiser' | 'submarine' | 'nothing'

export interface PlacingInfo {
  piece: ship,
  vertical: boolean
}

export interface ShipInfo {
  carrier: {
    name: string,
    size: number,
    left: number,
    max: number
  }
  battleship: {
    name: string,
    size: number,
    left: number,
    max: number
  }
  cruiser: {
    name: string,
    size: number,
    left: number,
    max: number
  }
  submarine: {
    name: string,
    size: number,
    left: number,
    max: number
  }
  nothing: {
    name: string,
    size: number,
    left: number,
    max: number
  }
}