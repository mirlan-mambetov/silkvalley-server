import slugify from 'slugify'

const generateRandomString = (length: number): string => {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters[randomIndex]
  }
  return result
}

export const generateSlug = (name: string) => {
  const baseSlug = slugify(name, { locale: 'en-EN', lower: true, trim: true })
  const uniqueString = generateRandomString(4)

  const slug = `${baseSlug}-${uniqueString}`

  return slug
}
