import { Injectable } from '@nestjs/common'
import * as fs from 'fs'
import * as path from 'path'
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
  saveFile(file: Express.Multer.File, destinationPath?: string) {
    const dest = destinationPath
      ? `${BASE_UPLOAD_PATH}/${destinationPath}`
      : BASE_UPLOAD_PATH
    const uniqueName = uuid()
    const fileName = file.originalname.split('.')[0]
    const fileExtName = path.extname(file.originalname)

    return new Promise((resolve, reject) => {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true })
        fs.writeFile(
          `${dest}/${fileName}-${uniqueName}${fileExtName}`,
          file.buffer,
          (err) => {
            if (err) reject(err)
            else resolve('Файл успешно загружен!')
          },
        )
      }
    })
  }

  deleteFile(pathName: string) {
    return new Promise((resolve, reject) => {
      if (pathName) {
        fs.unlinkSync(`public${pathName}`)
        resolve('Файл успешно удален')
      } else {
        reject('Не известая ошибка сервера')
      }
    })
  }

  /**
   *
   * @returns [] OF PATHS FILES
   */
  filndAllFilesPaths() {
    const paths: string[] = []
    function traverse(directoryPath: string) {
      const dirContents = fs.readdirSync(directoryPath)
      for (const item of dirContents) {
        const itemPath = path.join(directoryPath, item)
        const stats = fs.statSync(itemPath)
        if (stats.isFile()) {
          paths.push(itemPath.replace('public', ''))
        } else if (stats.isDirectory()) {
          traverse(itemPath)
        }
      }
    }
    traverse(BASE_UPLOAD_PATH)
    return paths
  }
}
