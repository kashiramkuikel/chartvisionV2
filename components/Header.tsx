
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <i className="fas fa-chart-line text-white text-xl"></i>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              ChartVision AI
            </h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-slate-300 hover:text-white transition-colors">Analyzer</a>
            <a href="#" className="text-slate-300 hover:text-white transition-colors">Patterns Library</a>
            <a href="#" className="text-slate-300 hover:text-white transition-colors">How it works</a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="bg-slate-800 hover:bg-slate-700 text-sm font-medium px-4 py-2 rounded-full transition-all">
              Documentation
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
