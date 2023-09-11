export const generateSlug = (name: string) => {
  const cleanedName = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

  return { cleanedName }
}
