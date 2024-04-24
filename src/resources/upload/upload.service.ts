import { Injectable } from '@nestjs/common'
import * as fs from 'fs'
import * as path from 'path'
import * as sharp from 'sharp'
import { BASE_UPLOAD_PATH } from 'src/constants/upload.constants'
import { v4 as uuid } from 'uuid'

@Injectable()
export class UploadService {
  /**
   *
   * @param file
   * @param destinationPath
   * @returns SAVED FILE TO STORAGE
   */
  async saveFile(
    file: Express.Multer.File,
    destinationPath?: string,
  ): Promise<{ filePath: string; message: string }> {
    const paths = await this.uploadDetail(file, destinationPath)
    return {
      filePath: paths.filePath,
      message: 'Файл успешно загружен',
    }
  }

  async saveMultiFiles(
    files: Array<Express.Multer.File>,
    destinationPath?: string,
  ) {
    const promises = files.map(
      async (file) => await this.uploadDetail(file, destinationPath),
    )
    const results = await Promise.all(promises)
    const paths = results.map((result) => ({
      filePath: result.filePath,
    }))
    return {
      paths: paths.map((path) => path.filePath),
      message: 'Файлы успешно загружены',
    }
  }

  /**
   *
   * @param pathName
   * @returns Message string
   */
  deleteFile(pathName: string): Promise<{ message: string }> {
    return new Promise((resolve, reject) => {
      if (!pathName) return { message: 'Неккоректный путь файла' }
      if (fs.existsSync(`public${pathName}`)) {
        fs.unlink(`public${pathName}`, (err) => {
          if (err) {
            reject(err)
          } else {
            resolve({ message: 'Файл успешно удален' })
          }
        })
      } else {
        reject('Файл не найден')
      }
    })
  }

  /**
   *
   * @returns [] OF PATHS FILES
   */
  filndAllFilesPaths(): { paths: string[]; totalSize: number } {
    const paths: string[] = []
    let totalSize = 0
    function traverse(directoryPath: string) {
      const dirContents = fs.readdirSync(directoryPath)
      for (const item of dirContents) {
        const itemPath = path.join(directoryPath, item)
        const stats = fs.statSync(itemPath)
        if (stats.isFile()) {
          const fileSize = stats.size
          totalSize += fileSize
          paths.push(itemPath.replace('public', ''))
        } else if (stats.isDirectory()) {
          traverse(itemPath)
        }
      }
    }
    traverse(BASE_UPLOAD_PATH)

    return { paths, totalSize }
  }

  private async uploadDetail(
    file: Express.Multer.File,
    destinationPath?: string,
  ): Promise<{ filePath: string }> {
    const dest = destinationPath
      ? `${BASE_UPLOAD_PATH}/${destinationPath}`
      : BASE_UPLOAD_PATH
    const uniqueName = uuid()
    const fileName = file.originalname.split('.')[0].replace(/\s+/g, '-')
    const fullName = `${dest}/${fileName}-${uniqueName}.webp`
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true })
    }
    await sharp(file.buffer)
      .toFormat('webp')
      .webp({ quality: 75 })
      .toFile(fullName)
    return {
      filePath: fullName.replace('public', ''),
    }
  }
}
