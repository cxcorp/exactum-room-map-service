import { Image, createCanvas } from 'canvas'
import { RoomMapping } from './types'

const renderRoom = (floorPlanImage: Image, room: RoomMapping) => {
  const canvas = createCanvas(floorPlanImage.width, floorPlanImage.height)
  const ctx = canvas.getContext('2d')

  ctx.drawImage(floorPlanImage, 0, 0)
  ctx.strokeStyle = 'red'
  ctx.lineWidth = 3

  ctx.arc(room.x, room.y, 50, 0, 2 * Math.PI)
  ctx.stroke()

  return canvas
}

export default renderRoom
