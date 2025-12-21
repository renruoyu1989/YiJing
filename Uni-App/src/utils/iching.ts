export interface CoinResult {
  coins: number[]; // e.g., [2, 3, 2]
  sum: number; // 6, 7, 8, or 9
  type: 'old-yin' | 'young-yang' | 'young-yin' | 'old-yang';
  isYang: boolean;
  isChanging: boolean;
}

export interface HexagramData {
  id: number;
  name: string;
  symbol: string; // 1=Yang, 0=Yin, from bottom to top
  description: string;
  use?: string; // 用九/用六（乾坤六爻皆变时）
  lines: {
    [key: number]: string; // 1-6
  };
  interpretation?: string; // 白话解说
}

export const tossCoins = (): CoinResult => {
  const coins = [
    Math.random() < 0.5 ? 2 : 3,
    Math.random() < 0.5 ? 2 : 3,
    Math.random() < 0.5 ? 2 : 3,
  ];
  const sum = coins.reduce((a, b) => a + b, 0);
  
  let type: CoinResult['type'] = 'young-yang';
  let isYang = true;
  let isChanging = false;

  switch (sum) {
    case 6:
      type = 'old-yin';
      isYang = false;
      isChanging = true;
      break;
    case 7:
      type = 'young-yang';
      isYang = true;
      isChanging = false;
      break;
    case 8:
      type = 'young-yin';
      isYang = false;
      isChanging = false;
      break;
    case 9:
      type = 'old-yang';
      isYang = true;
      isChanging = true;
      break;
  }

  return { coins, sum, type, isYang, isChanging };
};

export const getHexagramSymbol = (lines: CoinResult[]): string => {
  // lines are from bottom to top
  return lines.map(l => (l.isYang ? '1' : '0')).join('');
};
