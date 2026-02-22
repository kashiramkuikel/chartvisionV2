
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, Sentiment } from "../types";

const PATTERNS_LIST = [
  // Reversal Patterns
  "Double Top", "Double Bottom", "Head and Shoulders", "Inverse Head and Shoulders",
  "Triple Top", "Triple Bottom", "Rounding Top", "Rounding Bottom", "V-Reversal",
  "Diamond Top", "Diamond Bottom", "Adam and Eve Double Bottom", "Adam and Eve Double Top",
  "Bump and Run Reversal", "Quasimodo Pattern", "2B Reversal",

  // Continuation Patterns
  "Bull Flag", "Bear Flag", "Pennant", "Bullish Rectangle", "Bearish Rectangle",
  "Cup and Handle", "Inverse Cup and Handle", "High and Tight Flag",

  // Wedges and Triangles
  "Rising Wedge", "Falling Wedge", "Ascending Triangle", "Descending Triangle",
  "Symmetrical Triangle", "Broadening Wedge", "Expanding Triangle", "Megaphone Pattern",

  // Channels
  "Channel Up", "Channel Down", "Horizontal Channel",

  // Harmonic Patterns
  "Gartley", "Butterfly", "Bat", "Crab", "Shark", "Cypher", "Three Drives", "AB=CD", "5-0 Pattern",

  // Elliott Wave
  "Elliott Wave Impulse", "Elliott Wave Correction", "Leading Diagonal", "Ending Diagonal",

  // Candlestick Patterns (Single)
  "Doji", "Hammer", "Inverted Hammer", "Shooting Star", "Hanging Man", "Marubozu",
  "Spinning Top", "Pin Bar", "Belt Hold",

  // Candlestick Patterns (Double)
  "Bullish Engulfing", "Bearish Engulfing", "Piercing Line", "Dark Cloud Cover",
  "Bullish Harami", "Bearish Harami", "Tweezer Bottom", "Tweezer Top", "Kicker Pattern",
  "Inside Bar", "Outside Bar",

  // Candlestick Patterns (Triple+)
  "Morning Star", "Evening Star", "Morning Doji Star", "Evening Doji Star",
  "Three White Soldiers", "Three Black Crows", "Abandoned Baby", "Three-Line Strike",
  "Rising Three Methods", "Falling Three Methods", "Mat Hold", "Hikkake Pattern",

  // Gaps
  "Breakaway Gap", "Runaway Gap", "Exhaustion Gap", "Island Reversal",

  // Advanced/Specific
  "Wolfe Wave", "Shark Fin", "Fakey Pattern", "Dragon Pattern", "Sea Horse Pattern",
  "Black Swan", "White Swan", "Navarro 200", "Leonardo", "Total 1", "Total 2",
  "Bullish Divergence", "Bearish Divergence", "Hidden Bullish Divergence", "Hidden Bearish Divergence"
];

export async function analyzeChartImage(base64Image: string): Promise<AnalysisResult> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  // Clean base64 string if it contains prefix
  const dataOnly = base64Image.split(',')[1] || base64Image;

  const prompt = `Act as a Senior Technical Analyst with 20 years of experience. Analyze this financial chart image with extreme precision.
  
  Your objective is to:
  1. Identify technical analysis patterns from this comprehensive list: ${PATTERNS_LIST.join(", ")}.
  2. Identify major support and resistance horizontal lines based on historical touches and volume profiles (if visible).
  3. Identify key Fibonacci retracement levels (0.236, 0.382, 0.5, 0.618, 0.786) by identifying the most recent significant swing high and low.
  4. Identify the position and signal of major Moving Averages (MA 50, MA 200) if visible or inferable.
  5. Identify the current RSI (Relative Strength Index) value and its signal (Overbought, Oversold, Neutral).
  
  Strict Guidelines for Pattern Detection:
  - Only identify patterns that are clearly visible and follow strict geometric rules.
  - For each pattern, provide percentage-based coordinates (x, y, width, height from 0-100) that tightly bound the pattern.
  - Assign a confidence score (0-1) based on how well the pattern matches textbook definitions.
  - In the description, explain the psychological reasoning behind the pattern (e.g., "buyers exhausting at resistance").
  - Determine the sentiment (Bullish, Bearish, Neutral) based on the expected breakout direction.

  Strict Guidelines for Levels:
  - Support/Resistance: Focus on levels where price has reacted at least twice.
  - Fibonacci: Use the most relevant swing to draw these.
  - Provide y-coordinates as percentages (0-100) from the top.
  - Include price labels if they are legible on the Y-axis.

  Final Output:
  - Provide a general summary of the chart's overall trend (Uptrend, Downtrend, or Sideways).
  - Provide a high-level executive summary of your findings, including potential trade setups.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: dataOnly,
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            patterns: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  confidence: { type: Type.NUMBER },
                  coordinates: {
                    type: Type.OBJECT,
                    properties: {
                      x: { type: Type.NUMBER },
                      y: { type: Type.NUMBER },
                      width: { type: Type.NUMBER },
                      height: { type: Type.NUMBER },
                    },
                    required: ["x", "y", "width", "height"],
                  },
                  description: { type: Type.STRING },
                  sentiment: { type: Type.STRING, enum: [Sentiment.BULLISH, Sentiment.BEARISH, Sentiment.NEUTRAL] },
                },
                required: ["name", "confidence", "coordinates", "description", "sentiment"],
              },
            },
            summary: { type: Type.STRING },
            trend: { type: Type.STRING, enum: ["Uptrend", "Downtrend", "Sideways"] },
            supportResistanceLines: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  y: { type: Type.NUMBER },
                  label: { type: Type.STRING },
                  price: { type: Type.STRING },
                },
                required: ["y", "label"],
              },
            },
            fibonacciLevels: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  y: { type: Type.NUMBER },
                  label: { type: Type.STRING },
                  price: { type: Type.STRING },
                },
                required: ["y", "label"],
              },
            },
            movingAverages: {
              type: Type.OBJECT,
              properties: {
                ma50: {
                  type: Type.OBJECT,
                  properties: {
                    value: { type: Type.STRING },
                    signal: { type: Type.STRING },
                    y: { type: Type.NUMBER },
                  },
                  required: ["value", "signal"],
                },
                ma200: {
                  type: Type.OBJECT,
                  properties: {
                    value: { type: Type.STRING },
                    signal: { type: Type.STRING },
                    y: { type: Type.NUMBER },
                  },
                  required: ["value", "signal"],
                },
              },
            },
            rsi: {
              type: Type.OBJECT,
              properties: {
                value: { type: Type.STRING },
                signal: { type: Type.STRING },
              },
              required: ["value", "signal"],
            },
          },
          required: ["patterns", "summary", "trend", "supportResistanceLines", "fibonacciLevels", "movingAverages", "rsi"],
        },
      },
    });

    const result = JSON.parse(response.text);
    return result as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze the chart. Please ensure the image is a clear price chart.");
  }
}
