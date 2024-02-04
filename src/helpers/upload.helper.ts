import * as fs from 'fs'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { BASE_UPLOAD_PATH } from 'src/constants/upload.constants'
import { v4 as uuid } from 'uuid'

/**
 *
 * @param destinationPath
 * @returns
 * @deprecated
 * @description This helper not a using. Deprecated
 */
export const uploadHelper = (destinationPath?: string) => ({
  storage: diskStorage({
    destination: (req, file, cb) => {
      const dest = destinationPath
        ? `${BASE_UPLOAD_PATH}/${destinationPath}`
        : BASE_UPLOAD_PATH
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true })
      }
      cb(null, dest)
    },
    filename: (req, file, cb) => {
      const uniqueName = uuid()
      const fileName = file.originalname.split('.')[0]
      const fileExtName = extname(file.originalname)
      cb(null, `${uniqueName}-${fileName}${fileExtName}`)
    },
  }),
})
