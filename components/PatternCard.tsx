
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChartPattern, Sentiment } from '../types';

interface PatternCardProps {
  pattern: ChartPattern;
  isActive: boolean;
  onClick: () => void;
}

const PatternCard: React.FC<PatternCardProps> = ({ pattern, isActive, onClick }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const getSentimentColor = (sentiment: Sentiment) => {
    switch (sentiment) {
      case Sentiment.BULLISH: return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      case Sentiment.BEARISH: return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
      case Sentiment.NEUTRAL: return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
      default: return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    }
  };

  const getDescriptionBoxStyle = (sentiment: Sentiment) => {
    switch (sentiment) {
      case Sentiment.BULLISH: return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200';
      case Sentiment.BEARISH: return 'bg-rose-500/10 border-rose-500/20 text-rose-200';
      case Sentiment.NEUTRAL: return 'bg-blue-500/10 border-blue-500/20 text-blue-200';
      default: return 'bg-slate-950/50 border-slate-800/50 text-slate-400';
    }
  };

  const sentimentStyle = getSentimentColor(pattern.sentiment);
  const descriptionStyle = getDescriptionBoxStyle(pattern.sentiment);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
    onClick();
  };

  return (
    <div className="perspective-1000 w-full h-[220px] cursor-pointer" onClick={handleCardClick}>
      <motion.div
        className="relative w-full h-full preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
      >
        {/* Front Side */}
        <div 
          className={`absolute inset-0 backface-hidden p-4 rounded-xl border transition-all flex flex-col ${
            isActive 
              ? 'border-indigo-500 bg-slate-800 ring-2 ring-indigo-500/20' 
              : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-800'
          }`}
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-white">{pattern.name}</h3>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${sentimentStyle}`}>
              {pattern.sentiment}
            </span>
          </div>
          
          <div className={`p-3 rounded-lg border mb-4 text-sm ${descriptionStyle} flex-1 overflow-hidden`}>
            <p className="line-clamp-4">
              {pattern.description}
            </p>
          </div>

          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500" 
                  style={{ width: `${pattern.confidence * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500">{Math.round(pattern.confidence * 100)}% Match</span>
            </div>
            <span className="text-[10px] text-indigo-400 font-medium">Click to flip</span>
          </div>
        </div>

        {/* Back Side */}
        <div 
          className={`absolute inset-0 backface-hidden rotate-y-180 p-4 rounded-xl border border-indigo-500 bg-slate-800 flex flex-col`}
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-white">{pattern.name} - Details</h3>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${sentimentStyle}`}>
              {pattern.sentiment}
            </span>
          </div>
          
          <div className={`flex-1 p-3 rounded-lg border overflow-y-auto text-sm ${descriptionStyle}`}>
            <p className="leading-relaxed">
              {pattern.description}
            </p>
          </div>

          <div className="mt-3 flex justify-center">
            <span className="text-[10px] text-indigo-400 font-medium">Click to flip back</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PatternCard;
