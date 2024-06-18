import slugify from 'slugify'

export const generateSlug = (name: string) => {
  const slug = slugify(name, { locale: 'en-EN', lower: true, trim: true })

  return slug
}
