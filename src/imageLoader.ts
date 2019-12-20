import path from 'path'
import { loadImage, Image } from 'canvas'

export default class ImageLoader {
  private cache: { [filename: string]: Image | undefined } = {}

  constructor(private readonly directory: string) {}

  get(filename: string): Image | undefined {
    return this.cache[filename]
  }

  loadImages(images: string[]) {
    const promises: Promise<any>[] = []

    for (const filename of images) {
      const fullPath = path.join(this.directory, filename)
      promises.push(
        loadImage(fullPath).then(image => {
          this.cache[filename] = image
        })
      )
    }

    return Promise.all(promises)
  }
}
