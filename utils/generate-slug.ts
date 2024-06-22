import slugify from 'slugify'
import { v4 as uuidv4 } from 'uuid'

export const generateSlug = (name: string) => {
  const baseSlug = slugify(name, { locale: 'en-EN', lower: true, trim: true })

  const uuid = uuidv4()
  const slug = `${baseSlug}-${uuid}`

  return slug
}
