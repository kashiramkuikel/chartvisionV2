
export interface PatternCoordinate {
  x: number;      // 0-100 percentage
  y: number;      // 0-100 percentage
  width: number;  // 0-100 percentage
  height: number; // 0-100 percentage
}

export enum Sentiment {
  BULLISH = 'Bullish',
  BEARISH = 'Bearish',
  NEUTRAL = 'Neutral'
}

export interface ChartPattern {
  name: string;
  confidence: number;
  coordinates: PatternCoordinate;
  description: string;
  sentiment: Sentiment;
}

export interface LevelLine {
  price?: string;
  y: number; // 0-100 percentage
  label: string;
}

export interface IndicatorData {
  value: string;
  signal: string;
  y?: number; // For visual placement if applicable
}

export interface AnalysisResult {
  patterns: ChartPattern[];
  summary: string;
  trend: 'Uptrend' | 'Downtrend' | 'Sideways';
  supportResistanceLines: LevelLine[];
  fibonacciLevels: LevelLine[];
  movingAverages: {
    ma50?: IndicatorData;
    ma200?: IndicatorData;
  };
  rsi?: IndicatorData;
}

export interface AppState {
  image: string | null;
  analyzing: boolean;
  result: AnalysisResult | null;
  error: string | null;
}
