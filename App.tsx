
import React, { useState, useRef, useCallback } from 'react';
import Header from './components/Header';
import PatternCard from './components/PatternCard';
import ChartCanvas from './components/ChartCanvas';
import { analyzeChartImage } from './services/geminiService';
import { AppState, Sentiment } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    image: null,
    analyzing: false,
    result: null,
    error: null,
  });
  const [activePatternIndex, setActivePatternIndex] = useState<number | null>(null);
  const [visibility, setVisibility] = useState({
    sr: true,
    fib: true,
    ma: true,
    rsi: true,
    patterns: true
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setState({
          image: event.target?.result as string,
          analyzing: false,
          result: null,
          error: null,
        });
        setActivePatternIndex(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    if (!state.image) return;

    setState(prev => ({ ...prev, analyzing: true, error: null }));
    try {
      const analysis = await analyzeChartImage(state.image);
      setState(prev => ({ ...prev, result: analysis, analyzing: false }));
    } catch (err: any) {
      setState(prev => ({ ...prev, analyzing: false, error: err.message }));
    }
  };

  const reset = () => {
    setState({
      image: null,
      analyzing: false,
      result: null,
      error: null,
    });
    setActivePatternIndex(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {!state.image ? (
          <div className="h-[60vh] flex flex-col items-center justify-center">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full max-w-2xl aspect-video border-2 border-dashed border-slate-700 rounded-3xl bg-slate-900/30 hover:bg-slate-800/50 transition-all flex flex-col items-center justify-center cursor-pointer group"
            >
              <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <i className="fas fa-cloud-upload-alt text-indigo-500 text-2xl"></i>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Upload a Chart Image</h2>
              <p className="text-slate-400 text-center px-8">
                Drop your stock, crypto, or forex chart screenshot here.<br />
                We support PNG, JPG, and WEBP formats.
              </p>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="hidden" 
                accept="image/*"
              />
            </div>
            <div className="mt-8 flex gap-6 text-slate-500 text-sm">
              <div className="flex items-center gap-2"><i className="fas fa-check-circle text-indigo-500"></i> 100+ Pattern Models</div>
              <div className="flex items-center gap-2"><i className="fas fa-check-circle text-indigo-500"></i> Candlestick Analysis</div>
              <div className="flex items-center gap-2"><i className="fas fa-check-circle text-indigo-500"></i> Trend Detection</div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Image Display */}
            <div className="lg:col-span-9 space-y-6">
              <div className="flex justify-between items-center">
                <button 
                  onClick={reset}
                  className="text-slate-400 hover:text-white flex items-center gap-2 text-sm transition-colors"
                >
                  <i className="fas fa-arrow-left"></i> Change Image
                </button>
                <div className="flex gap-2">
                  {!state.result && !state.analyzing && (
                    <button 
                      onClick={startAnalysis}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-medium shadow-lg shadow-indigo-500/20 transition-all"
                    >
                      Run AI Analysis
                    </button>
                  )}
                  {state.result && (
                    <span className="bg-slate-800 text-indigo-400 border border-indigo-500/30 px-4 py-2 rounded-lg text-sm font-medium">
                      Analysis Complete
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-6 items-start">
                {/* Control Sidebar */}
                <div className="flex flex-col gap-2 w-full lg:w-32 shrink-0">
                  <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-2 flex flex-col gap-1.5">
                    <h4 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 px-1">Layers</h4>
                    
                    <button 
                      onClick={() => setVisibility(v => ({ ...v, sr: !v.sr }))}
                      className={`w-full h-8 px-2 rounded-lg flex items-center gap-2 transition-all border ${
                        visibility.sr ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <i className="fas fa-grip-lines text-[10px]"></i>
                      <span className="text-[10px] font-semibold truncate">S/R</span>
                    </button>

                    <button 
                      onClick={() => setVisibility(v => ({ ...v, fib: !v.fib }))}
                      className={`w-full h-8 px-2 rounded-lg flex items-center gap-2 transition-all border ${
                        visibility.fib ? 'bg-amber-600 border-amber-500 text-white shadow-md shadow-amber-500/20' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <i className="fas fa-stream text-[10px]"></i>
                      <span className="text-[10px] font-semibold truncate">Fib</span>
                    </button>

                    <button 
                      onClick={() => setVisibility(v => ({ ...v, ma: !v.ma }))}
                      className={`w-full h-8 px-2 rounded-lg flex items-center gap-2 transition-all border ${
                        visibility.ma ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/20' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <i className="fas fa-wave-square text-[10px]"></i>
                      <span className="text-[10px] font-semibold truncate">MA</span>
                    </button>

                    <button 
                      onClick={() => setVisibility(v => ({ ...v, rsi: !v.rsi }))}
                      className={`w-full h-8 px-2 rounded-lg flex items-center gap-2 transition-all border ${
                        visibility.rsi ? 'bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-500/20' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <i className="fas fa-chart-line text-[10px]"></i>
                      <span className="text-[10px] font-semibold truncate">RSI</span>
                    </button>

                    <button 
                      onClick={() => setVisibility(v => ({ ...v, patterns: !v.patterns }))}
                      className={`w-full h-8 px-2 rounded-lg flex items-center gap-2 transition-all border ${
                        visibility.patterns ? 'bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-500/20' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <i className="fas fa-shapes text-[10px]"></i>
                      <span className="text-[10px] font-semibold truncate">Patterns</span>
                    </button>
                  </div>
                </div>

                <div className="relative flex-1">
                  <ChartCanvas 
                    imageUrl={state.image} 
                    patterns={state.result?.patterns || []}
                    supportResistanceLines={state.result?.supportResistanceLines || []}
                    fibonacciLevels={state.result?.fibonacciLevels || []}
                    movingAverages={state.result?.movingAverages || {}}
                    rsi={state.result?.rsi}
                    visibility={visibility}
                    activePatternIndex={activePatternIndex}
                    onPatternClick={(index) => setActivePatternIndex(index)}
                  />
                  
                  {state.analyzing && (
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-20">
                      <div className="relative w-24 h-24 mb-6">
                        <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center text-indigo-400">
                          <i className="fas fa-brain text-2xl"></i>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-white animate-pulse">Scanning Price Geometry...</h3>
                      <p className="text-slate-400 mt-2">Checking 100+ patterns and trend indicators</p>
                    </div>
                  )}
                </div>
              </div>

              {state.result && (
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <i className="fas fa-info-circle text-indigo-500"></i>
                    AI Insights Summary
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                      <span className="text-slate-500 text-xs block uppercase tracking-wider mb-1">Detected Trend</span>
                      <span className={`text-xl font-bold ${
                        state.result.trend === 'Uptrend' ? 'text-emerald-400' : 
                        state.result.trend === 'Downtrend' ? 'text-rose-400' : 'text-amber-400'
                      }`}>
                        {state.result.trend}
                      </span>
                    </div>
                    <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                      <span className="text-slate-500 text-xs block uppercase tracking-wider mb-1">Total Patterns</span>
                      <span className="text-xl font-bold text-white">{state.result.patterns.length} Identified</span>
                    </div>
                    <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                      <span className="text-slate-500 text-xs block uppercase tracking-wider mb-1">Confidence Avg</span>
                      <span className="text-xl font-bold text-indigo-400">
                        {Math.round(state.result.patterns.reduce((acc, p) => acc + p.confidence, 0) / (state.result.patterns.length || 1) * 100)}%
                      </span>
                    </div>
                  </div>
                  <p className="text-slate-300 leading-relaxed italic">
                    &ldquo;{state.result.summary}&rdquo;
                  </p>
                </div>
              )}
            </div>

            {/* Right Column - Results List */}
            <div className="lg:col-span-3 h-full">
              <div className="sticky top-24">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col h-[calc(100vh-10rem)]">
                  <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                    <h2 className="font-bold text-white">Pattern Watchlist</h2>
                    <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-bold px-2 py-0.5 rounded border border-indigo-500/20">LIVE SCAN</span>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {!state.result && !state.analyzing && (
                      <div className="h-full flex flex-col items-center justify-center text-center p-6">
                        <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-4 opacity-50">
                          <i className="fas fa-list-ul text-slate-500"></i>
                        </div>
                        <p className="text-slate-500 text-sm">Upload and scan to see detected patterns here.</p>
                      </div>
                    )}

                    {state.analyzing && (
                      <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="animate-pulse bg-slate-800 h-32 rounded-xl border border-slate-700/50"></div>
                        ))}
                      </div>
                    )}

                    {state.error && (
                      <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-xl text-rose-400 text-sm">
                        <i className="fas fa-exclamation-triangle mr-2"></i>
                        {state.error}
                      </div>
                    )}

                    {state.result?.patterns.map((pattern, index) => (
                      <PatternCard 
                        key={index} 
                        pattern={pattern} 
                        isActive={activePatternIndex === index}
                        onClick={() => setActivePatternIndex(index)}
                      />
                    ))}
                    
                    {state.result && state.result.patterns.length === 0 && (
                      <div className="text-center p-8 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
                        <i className="fas fa-search text-slate-600 text-2xl mb-3 block"></i>
                        <p className="text-slate-400 text-sm">No significant patterns detected in this timeframe.</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 border-t border-slate-800 bg-slate-950/50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                        <i className="fas fa-shield-alt text-slate-500 text-xs"></i>
                      </div>
                      <div className="flex-1">
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block">Disclaimer</span>
                        <p className="text-[9px] text-slate-600 leading-tight">
                          This is an AI analysis tool and does not constitute financial advice. Always perform your own due diligence.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-800 bg-slate-900/30 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-slate-500 text-sm">
            © 2024 ChartVision AI Pattern Detection. Built with Gemini 3.
          </div>
          <div className="flex gap-6 text-slate-400 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
