export function generateProductId(length: number = 5) {
  let result = ''
  const characters = '012345'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  const timestamp = Date.now().toString()
  result += timestamp
  return result
}
