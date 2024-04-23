import slugify from 'slugify'
import { generateProductId } from './generate.id'

export const createSlugName = (name: string) => {
  const UNIQUE_ID = generateProductId(3)
  const slugName = name ? slugify(name, { lower: true, locale: 'eng' }) : null

  return `${slugName}-${UNIQUE_ID}`
}
