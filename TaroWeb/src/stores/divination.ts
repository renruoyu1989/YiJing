import { defineStore } from 'pinia'
import type { LineValue } from '@/utils/iching'
import { isMovingLine, lineToBit, linesToSymbol } from '@/utils/iching'

export const useDivinationStore = defineStore('divination', {
  state: () => ({
    lines: [] as LineValue[]
  }),
  getters: {
    symbol(state): string {
      return linesToSymbol(state.lines)
    },
    bits(state): (0 | 1)[] {
      return state.lines.map(lineToBit)
    },
    movingLineIndexes(state): number[] {
      const indexes: number[] = []
      state.lines.forEach((line, idx) => {
        if (isMovingLine(line)) indexes.push(idx)
      })
      return indexes
    }
  },
  actions: {
    reset() {
      this.lines = []
    },
    setLines(lines: LineValue[]) {
      this.lines = [...lines]
    },
    addLine(line: LineValue) {
      if (this.lines.length >= 6) return
      this.lines = [...this.lines, line]
    }
  }
})

