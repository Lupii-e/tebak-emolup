import React from 'react';
import { Play, Trophy } from 'lucide-react';
import { Button } from './Button';

interface StartScreenProps {
  onStart: () => void;
  highScore: number;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart, highScore }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-50 text-center animate-pop">
      <div className="mb-8 relative">
        <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 rounded-full animate-pulse"></div>
        <div className="relative text-8xl mb-4">🤔</div>
        <h1 className="relative text-4xl font-extrabold text-slate-800 tracking-tight">
          Tebak <span className="text-indigo-600">Emoji</span>
        </h1>
        <p className="text-slate-500 mt-2">Seberapa jago kamu menerjemahkan emoji?</p>
      </div>

      <div className="w-full max-w-xs space-y-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center space-x-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <span className="text-slate-600 font-medium">Skor Tertinggi: {highScore}</span>
        </div>

        <Button onClick={onStart} fullWidth className="flex items-center justify-center space-x-2 text-lg">
          <Play className="w-5 h-5 fill-current" />
          <span>Mulai Main</span>
        </Button>
      </div>
      
      <div className="mt-12 text-sm text-slate-400">
        v1.0.0 • Mobile Edition
      </div>
    </div>
  );
};