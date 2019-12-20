import express, { ErrorRequestHandler } from 'express'
require('express-async-errors')
import exphbs from 'express-handlebars'
import helmet from 'helmet'
import cors from 'cors'

import config from './config'
import makeRenderRouter from './renderController'
import ImageLoader from './imageLoader'

const imageLoader = new ImageLoader(config.IMAGES_DIR)

imageLoader
  .loadImages([
    'pkerros.gif',
    '1kerros.gif',
    '2kerros.gif',
    '3kerros.gif',
    '4kerros.gif'
  ])
  .then(() => {
    const app = express()

    if (config.NODE_ENV === 'production') {
      app.enable('etag')
      app.use(helmet({ hsts: false }))
    }

    app.engine('handlebars', exphbs())
    app.set('view engine', 'handlebars')

    app.get('/', (req, res) => {
      res.redirect(302, '/rooms')
    })

    app.get('/rooms', (req, res) => {
      res.render('rooms', {
        data: Object.entries(config.DATA_FILE).map(([filename, rooms]) => ({
          filename,
          rooms
        })),
        helpers: {
          roomImgHref: (room: any) => `/img/v1/rooms/${room}.png`
        }
      })
    })

    app.use('/img/v1/rooms', makeRenderRouter(imageLoader))

    app.get('/api/v1/rooms', cors({ methods: ['GET'] }), (req, res) => {
      const allRooms = Object.values(config.DATA_FILE).reduce<string[]>(
        (acc, rooms) => {
          for (const room of rooms) {
            acc.push(room.room)
          }
          return acc
        },
        []
      )
      res.json(allRooms)
    })

    app.use('*', (req, res, next) => {
      res.status(404).render('404')
    })

    app.use(((err, req, res, next) => {
      console.error(err)
      res.status(500).render('500')
    }) as ErrorRequestHandler)

    app.listen(config.PORT, config.HOST, e => {
      if (e) {
        console.error(e)
        process.exit(1)
      }
      console.log(`Listening on http://${config.HOST}:${config.PORT}`)
    })
  })
  .catch(e => {
    console.error('Failed to preload floor plan images', e)
    process.exit(1)
  })
