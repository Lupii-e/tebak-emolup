export interface Question {
  id: number;
  phrase: string;
  category: 'Makanan' | 'Aktivitas' | 'Perasaan' | 'Umum';
  options: string[]; // Array of emoji strings
  correctIndex: number;
}

export type GameState = 'start' | 'playing' | 'end';