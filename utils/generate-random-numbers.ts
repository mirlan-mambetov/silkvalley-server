export class GenerateRandomNumbers {
  private generatedNumbers: Set<number>

  constructor() {
    this.generatedNumbers = new Set<number>()
  }

  generate(): number {
    let number: number
    do {
      const length = Math.floor(Math.random() * 3) + 4
      const min = Math.pow(10, length - 1)
      const max = Math.pow(10, length) - 1
      number = Math.floor(Math.random() * (max - min + 1)) + min
    } while (this.generatedNumbers.has(number))
    this.generatedNumbers.add(number)
    return number
  }

  clear() {
    this.generatedNumbers.clear()
  }
}

export const generateRandomNumbers = new GenerateRandomNumbers()
