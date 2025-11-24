import React, { useState, useEffect, useCallback } from 'react';
import { QUESTIONS } from './constants';
import { GameState } from './types';
import { StartScreen } from './components/StartScreen';
import { ResultScreen } from './components/ResultScreen';
import { ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from './components/Button';

// Helper component for the Game Screen defined internally to keep state sharing simple in this context
const GameView: React.FC<{
  questionIndex: number;
  score: number;
  onAnswer: (isCorrect: boolean) => void;
}> = ({ questionIndex, score, onAnswer }) => {
  const currentQuestion = QUESTIONS[questionIndex];
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isProcessed, setIsProcessed] = useState(false);
  const [shake, setShake] = useState(false);

  // Reset local state when question changes
  useEffect(() => {
    setSelectedIdx(null);
    setIsProcessed(false);
    setShake(false);
  }, [questionIndex]);

  const handleSelect = (idx: number) => {
    if (isProcessed) return;

    setSelectedIdx(idx);
    setIsProcessed(true);

    const correct = idx === currentQuestion.correctIndex;
    
    if (!correct) {
      setShake(true);
      // Remove shake class after animation completes to allow re-triggering if needed (though we auto-advance)
      setTimeout(() => setShake(false), 500);
    }

    // Delay before moving to next question so user sees the result
    setTimeout(() => {
      onAnswer(correct);
    }, 1200);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 max-w-md mx-auto shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-white px-6 py-4 shadow-sm z-10 flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Soal</span>
          <span className="text-xl font-bold text-slate-800">{questionIndex + 1} <span className="text-slate-300">/</span> {QUESTIONS.length}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Skor</span>
          <span className="text-xl font-bold text-indigo-600">{score}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-1.5">
        <div 
          className="bg-indigo-500 h-1.5 transition-all duration-500 ease-out"
          style={{ width: `${((questionIndex) / QUESTIONS.length) * 100}%` }}
        ></div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-6 items-center justify-center">
        <div className="mb-2">
          <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold uppercase tracking-wide">
            {currentQuestion.category}
          </span>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-black text-slate-800 text-center mb-10 leading-tight">
          "{currentQuestion.phrase}"
        </h2>

        <div className="w-full grid grid-cols-1 gap-4">
          {currentQuestion.options.map((option, idx) => {
            let stateClass = "bg-white border-2 border-slate-100 hover:border-indigo-200";
            let icon = null;

            if (isProcessed) {
               if (idx === currentQuestion.correctIndex) {
                 stateClass = "bg-green-50 border-2 border-green-500"; // Always show correct answer
                 icon = <CheckCircle2 className="w-6 h-6 text-green-500 absolute right-4" />;
               } else if (idx === selectedIdx) {
                 stateClass = "bg-red-50 border-2 border-red-500 animate-shake"; // Wrong selection
                 icon = <XCircle className="w-6 h-6 text-red-500 absolute right-4" />;
               } else {
                 stateClass = "bg-slate-50 border-2 border-transparent opacity-50 grayscale"; // Others fade out
               }
            }

            return (
              <button
                key={idx}
                disabled={isProcessed}
                onClick={() => handleSelect(idx)}
                className={`
                  relative flex items-center justify-center h-20 rounded-2xl text-4xl shadow-sm transition-all duration-200
                  ${stateClass}
                  ${!isProcessed && 'active:scale-95 hover:shadow-md'}
                `}
              >
                <span>{option}</span>
                {icon}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Footer hint */}
      <div className="p-6 text-center text-slate-400 text-sm">
        Pilih kombinasi emoji yang tepat
      </div>
    </div>
  );
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Load highscore on mount
  useEffect(() => {
    const saved = localStorage.getItem('emoji_highscore');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const handleStart = () => {
    setGameState('playing');
    setCurrentQIndex(0);
    setScore(0);
  };

  const handleAnswer = (isCorrect: boolean) => {
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);

    const nextIndex = currentQIndex + 1;
    if (nextIndex < QUESTIONS.length) {
      setCurrentQIndex(nextIndex);
    } else {
      // Game Over
      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('emoji_highscore', newScore.toString());
      }
      setGameState('end');
    }
  };

  const handleHome = () => {
    setGameState('start');
  };

  return (
    <div className="antialiased text-slate-800 bg-slate-50 min-h-screen">
      {gameState === 'start' && (
        <StartScreen onStart={handleStart} highScore={highScore} />
      )}
      
      {gameState === 'playing' && (
        <GameView 
          questionIndex={currentQIndex} 
          score={score}
          onAnswer={handleAnswer} 
        />
      )}

      {gameState === 'end' && (
        <ResultScreen 
          score={score} 
          totalQuestions={QUESTIONS.length} 
          onRestart={handleStart}
          onHome={handleHome}
        />
      )}
    </div>
  );
}