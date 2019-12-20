import express from 'express'

import config from './config'
import { RoomMapping } from './types'
import ImageLoader from './imageLoader'
import canvasRenderer from './canvasRenderer'

/**
 * Bakes mapping.json into a lookup table where the key is the
 * uppercased room and the value is the room with the filename of the floor plan.
 */
const roomMappingToLookup = () => {
  const mapping: { [roomName: string]: RoomMapping & { filename: string } } = {}

  for (const [filename, rooms] of Object.entries(config.DATA_FILE)) {
    for (const room of rooms) {
      mapping[room.room] = {
        ...room,
        room: room.room.toUpperCase(),
        filename
      }
    }
  }

  return mapping
}

const roomLookup = roomMappingToLookup()

const init = (imageLoader: ImageLoader) => {
  const router = express.Router()

  router.get('/:room.png', async (req, res, next) => {
    const roomName = req.params.room && req.params.room.trim().toUpperCase()
    if (!roomName) {
      return next()
    }

    const room = roomLookup[roomName]

    if (!room) {
      return next()
    }

    const floorPlanImage = imageLoader.get(room.filename)
    if (!floorPlanImage) {
      return next(
        new Error(
          `Invalid mapping, no floor plan image found with filename ${room.filename} for room ${room.room}`
        )
      )
    }

    res.type('png')
    canvasRenderer(floorPlanImage, room)
      .createPNGStream({
        compressionLevel: 9
      })
      .pipe(res)
  })

  return router
}

export default init
