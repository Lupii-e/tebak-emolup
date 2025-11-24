import React from 'react';
import { RefreshCw, Home, Star } from 'lucide-react';
import { Button } from './Button';

interface ResultScreenProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
  onHome: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ score, totalQuestions, onRestart, onHome }) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  
  let message = "";
  let emoji = "";
  
  if (percentage === 100) {
    message = "Sempurna! Kamu Jenius!";
    emoji = "🏆";
  } else if (percentage >= 80) {
    message = "Luar Biasa!";
    emoji = "🤩";
  } else if (percentage >= 50) {
    message = "Lumayan Bagus!";
    emoji = "😎";
  } else {
    message = "Coba Lagi Ya!";
    emoji = "😅";
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-50 text-center animate-pop">
      <div className="mb-8">
        <div className="text-9xl mb-4 animate-bounce">{emoji}</div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">{message}</h2>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 w-full max-w-xs mb-8">
        <div className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-1">Skor Kamu</div>
        <div className="text-5xl font-black text-indigo-600 mb-2">{score}/{totalQuestions}</div>
        <div className="flex justify-center space-x-1">
          {[...Array(5)].map((_, i) => (
             <Star 
               key={i} 
               className={`w-6 h-6 ${i < Math.round(percentage / 20) ? 'text-yellow-400 fill-current' : 'text-slate-200'}`} 
             />
          ))}
        </div>
      </div>

      <div className="w-full max-w-xs space-y-3">
        <Button onClick={onRestart} fullWidth className="flex items-center justify-center space-x-2">
          <RefreshCw className="w-5 h-5" />
          <span>Main Lagi</span>
        </Button>
        <Button onClick={onHome} variant="outline" fullWidth className="flex items-center justify-center space-x-2">
          <Home className="w-5 h-5" />
          <span>Ke Beranda</span>
        </Button>
      </div>
    </div>
  );
};