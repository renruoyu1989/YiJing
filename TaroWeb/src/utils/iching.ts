export type CoinValue = 2 | 3
export type LineValue = 6 | 7 | 8 | 9

export function tossCoin(): CoinValue {
  return Math.random() < 0.5 ? 2 : 3
}

export function getLine(): LineValue {
  const sum = tossCoin() + tossCoin() + tossCoin()
  if (sum === 6 || sum === 7 || sum === 8 || sum === 9) return sum
  return 7
}

export function generateHexagram(): LineValue[] {
  const lines: LineValue[] = []
  for (let i = 0; i < 6; i += 1) {
    lines.push(getLine())
  }
  return lines
}

export function lineToBit(line: LineValue): 0 | 1 {
  return line === 6 || line === 8 ? 0 : 1
}

export function linesToSymbol(lines: LineValue[]): string {
  return lines.map(lineToBit).join('')
}

export function isMovingLine(line: LineValue): boolean {
  return line === 6 || line === 9
}

export function tossThreeCoins(): [CoinValue, CoinValue, CoinValue] {
  return [tossCoin(), tossCoin(), tossCoin()]
}

export function coinsToLine(coins: readonly CoinValue[]): LineValue {
  const sum = coins.reduce((acc, v) => acc + v, 0)
  if (sum === 6 || sum === 7 || sum === 8 || sum === 9) return sum
  return 7
}

