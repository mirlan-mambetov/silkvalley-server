const SECRET = process.env.HASH_SECRET

/**
 *
 * @param data
 * @returns
 */
export function encryptData(data: any): string {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET).toString()
}
