export const generateSlug = (name: string) => {
  const slugName = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

  return { slugName }
}
