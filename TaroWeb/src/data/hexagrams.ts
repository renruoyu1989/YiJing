import hexagramsJson from './hexagrams.json'

export interface Hexagram {
  id: number
  name: string
  symbol: string
  guaci: string
  yaoci: string[]
}

export const hexagrams = hexagramsJson as Hexagram[]

export function findHexagramBySymbol(symbol: string): Hexagram | undefined {
  return hexagrams.find((h) => h.symbol === symbol)
}

