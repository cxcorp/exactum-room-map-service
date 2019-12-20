export interface RoomMapping {
  x: number
  y: number
  room: string
}

export type DataFile = { [filename: string]: RoomMapping[] }
