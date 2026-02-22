
import React, { useRef, useEffect, useState } from 'react';
import { ChartPattern, LevelLine, IndicatorData } from '../types';

interface ChartCanvasProps {
  imageUrl: string;
  patterns: ChartPattern[];
  supportResistanceLines: LevelLine[];
  fibonacciLevels: LevelLine[];
  movingAverages: {
    ma50?: IndicatorData;
    ma200?: IndicatorData;
  };
  rsi?: IndicatorData;
  visibility: {
    sr: boolean;
    fib: boolean;
    ma: boolean;
    rsi: boolean;
    patterns: boolean;
  };
  activePatternIndex: number | null;
  onPatternClick: (index: number) => void;
}

const ChartCanvas: React.FC<ChartCanvasProps> = ({ 
  imageUrl, 
  patterns, 
  supportResistanceLines,
  fibonacciLevels,
  movingAverages,
  rsi,
  visibility,
  activePatternIndex, 
  onPatternClick 
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (chartRef.current) {
        setDimensions({
          width: chartRef.current.clientWidth,
          height: chartRef.current.clientHeight
        });
      }
    };

    window.addEventListener('resize', updateDimensions);
    updateDimensions();

    return () => window.removeEventListener('resize', updateDimensions);
  }, [imageUrl]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setDimensions({
      width: e.currentTarget.clientWidth,
      height: e.currentTarget.clientHeight
    });
  };

  return (
    <div ref={chartRef} className="relative w-full rounded-2xl overflow-hidden bg-slate-950 group">
      <img 
        src={imageUrl} 
        alt="Analyzed Chart" 
        className="w-full h-auto block"
        onLoad={handleImageLoad}
      />
        
        {/* Pattern Overlays */}
        <svg 
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        >
          {/* Support & Resistance Lines */}
          {visibility.sr && supportResistanceLines.map((line, index) => {
            const pxY = (line.y / 100) * dimensions.height;
            const isResistance = line.label.toLowerCase().includes('resistance');
            const color = isResistance ? '#f43f5e' : '#10b981';
            return (
              <g key={`sr-${index}`}>
                <line 
                  x1="0" 
                  y1={pxY} 
                  x2={dimensions.width} 
                  y2={pxY} 
                  stroke={color} 
                  strokeWidth="1.5" 
                  strokeDasharray="6 3"
                  opacity="0.7"
                />
                <text 
                  x="10" 
                  y={pxY - 6} 
                  fill={color} 
                  fontSize="11" 
                  fontWeight="bold"
                  className="select-none drop-shadow-md"
                >
                  {line.label} {line.price ? `(${line.price})` : ''}
                </text>
              </g>
            );
          })}

          {/* Fibonacci Levels */}
          {visibility.fib && fibonacciLevels.map((line, index) => {
            const pxY = (line.y / 100) * dimensions.height;
            return (
              <g key={`fib-${index}`}>
                <line 
                  x1="0" 
                  y1={pxY} 
                  x2={dimensions.width} 
                  y2={pxY} 
                  stroke="#fbbf24" 
                  strokeWidth="1" 
                  opacity="0.6"
                />
                <text 
                  x={dimensions.width - 10} 
                  y={pxY - 6} 
                  fill="#fbbf24" 
                  fontSize="10" 
                  textAnchor="end"
                  fontWeight="bold"
                  className="select-none drop-shadow-md"
                >
                  {line.label} {line.price ? `(${line.price})` : ''}
                </text>
              </g>
            );
          })}

          {/* Moving Averages */}
          {visibility.ma && (
            <>
              {movingAverages.ma50?.y && (
                <g key="ma50">
                  <line x1="0" y1={(movingAverages.ma50.y / 100) * dimensions.height} x2={dimensions.width} y2={(movingAverages.ma50.y / 100) * dimensions.height} stroke="#3b82f6" strokeWidth="2" opacity="0.6" />
                  <text x="10" y={(movingAverages.ma50.y / 100) * dimensions.height + 14} fill="#3b82f6" fontSize="10" fontWeight="bold">MA 50: {movingAverages.ma50.value}</text>
                </g>
              )}
              {movingAverages.ma200?.y && (
                <g key="ma200">
                  <line x1="0" y1={(movingAverages.ma200.y / 100) * dimensions.height} x2={dimensions.width} y2={(movingAverages.ma200.y / 100) * dimensions.height} stroke="#ef4444" strokeWidth="2" opacity="0.6" />
                  <text x="10" y={(movingAverages.ma200.y / 100) * dimensions.height + 14} fill="#ef4444" fontSize="10" fontWeight="bold">MA 200: {movingAverages.ma200.value}</text>
                </g>
              )}
            </>
          )}

          {visibility.patterns && patterns.map((pattern, index) => {
            const { x, y, width, height } = pattern.coordinates;
            const pxX = (x / 100) * dimensions.width;
            const pxY = (y / 100) * dimensions.height;
            const pxW = (width / 100) * dimensions.width;
            const pxH = (height / 100) * dimensions.height;
            
            const isActive = index === activePatternIndex;
            
            return (
              <g key={index} className="pointer-events-auto cursor-pointer" onClick={() => onPatternClick(index)}>
                <rect
                  x={pxX}
                  y={pxY}
                  width={pxW}
                  height={pxH}
                  fill="transparent"
                  stroke={isActive ? '#6366f1' : 'rgba(99, 102, 241, 0.3)'}
                  strokeWidth={isActive ? 3 : 2}
                  className="transition-all duration-300"
                />
                {isActive && (
                  <rect
                    x={pxX}
                    y={pxY}
                    width={pxW}
                    height={pxH}
                    fill="rgba(99, 102, 241, 0.1)"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* RSI Indicator Overlay */}
        {visibility.rsi && rsi && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-purple-500/30 flex items-center gap-4 z-20">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">RSI (14)</span>
              <span className={`text-lg font-bold ${
                parseFloat(rsi.value) > 70 ? 'text-rose-400' : 
                parseFloat(rsi.value) < 30 ? 'text-emerald-400' : 'text-white'
              }`}>
                {rsi.value}
              </span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Signal</span>
              <span className="text-sm font-medium text-purple-400">{rsi.signal}</span>
            </div>
          </div>
        )}

        <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs font-medium text-white flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          AI Inspection Overlay Active
        </div>
      </div>
    );
  };

export default ChartCanvas;
