import path from 'path'
import { DataFile } from './types'

const { NODE_ENV, PORT, HOST, SENTRY_DSN, SENTRY_RELEASE } = process.env

const parsedPort = PORT ? parseInt(PORT, 10) : NaN

const DATA_DIR = path.join(__dirname, '../data')
const IMAGES_DIR = path.join(DATA_DIR, 'images')

const DATA_FILE: DataFile = require(path.join(DATA_DIR, 'mapping.json'))

export default {
  IMAGES_DIR,
  DATA_FILE,
  NODE_ENV,
  PORT: isNaN(parsedPort) ? 6755 : parsedPort,
  HOST: HOST || '0.0.0.0',
  SENTRY_DSN,
  SENTRY_RELEASE
}
