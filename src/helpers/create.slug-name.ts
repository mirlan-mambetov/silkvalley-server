import slugify from 'slugify'
import { v4 as uuidV4 } from 'uuid'

export const createSlugName = (name: string) => {
  const template = name.replace(/\./g, '')
  const UNIQUE_ID = uuidV4().slice(0, 2)
  const slugName = slugify(template, { lower: true, locale: 'eng' })
  return `${slugName}-${UNIQUE_ID}`
}
