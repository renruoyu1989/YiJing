import hexagramsJson from './hexagrams.json'
import hexagramsTwJson from './hexagrams-tw.json'

export interface Hexagram {
  id: number
  name: string
  symbol: string
  guaci: string
  yaoci: string[]
}

const hexagramsMap: Record<string, Hexagram[]> = {
  'zh-CN': hexagramsJson as Hexagram[],
  'zh-TW': hexagramsTwJson as Hexagram[]
}

// Default export for backward compatibility, though using findHexagramBySymbol with lang is preferred
export const hexagrams = hexagramsJson as Hexagram[]

export function findHexagramBySymbol(symbol: string, lang: string = 'zh-CN'): Hexagram | undefined {
  const list = hexagramsMap[lang] || hexagramsMap['zh-CN']
  return list.find((h) => h.symbol === symbol)
}
