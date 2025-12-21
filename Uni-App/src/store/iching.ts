import { defineStore } from 'pinia';
import { type CoinResult, type HexagramData, getHexagramSymbol } from '../utils/iching';
import hexagramsData from '../data/hexagrams.json';

export const useIChingStore = defineStore('iching', {
    state: () => ({
        history: [] as CoinResult[][], // Not used yet, for future local storage
        currentLines: [] as CoinResult[], // Bottom to top
        isDivinating: false,
        hexagrams: hexagramsData as HexagramData[],
    }),

    getters: {
        currentSymbol(state): string {
            return getHexagramSymbol(state.currentLines);
        },
        currentHexagram(state): HexagramData | undefined {
            if (state.currentLines.length < 6) return undefined;
            const symbol = this.currentSymbol;
            return state.hexagrams.find(h => h.symbol === symbol);
        },
        hasMutation(state): boolean {
            return state.currentLines.some(l => l.isChanging);
        },
        mutatedLinesIndices(state): number[] {
            return state.currentLines
                .map((l, i) => (l.isChanging ? i + 1 : -1))
                .filter(i => i !== -1);
        }
    },

    actions: {
        addLine(line: CoinResult) {
            if (this.currentLines.length < 6) {
                this.currentLines.push(line);
            }
        },
        resetDivination() {
            this.currentLines = [];
            this.isDivinating = true;
        },
        saveHistory() {
            if (this.currentLines.length === 6) {
                // Save to local storage logic here
                const historyData = uni.getStorageSync('iching_history') || [];
                historyData.push({
                    lines: this.currentLines,
                    date: new Date().toISOString()
                });
                uni.setStorageSync('iching_history', historyData);
            }
        }
    }
});
