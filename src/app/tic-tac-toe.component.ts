import { Component } from '@angular/core';

type Player = 'X' | 'O';
type Square = Player | null;
type GameResult = Player | 'Draw' | null;
type GameMode = 'computer' | 'two-players';

const HUMAN: Player = 'X';
const COMPUTER: Player = 'O';

@Component({
  standalone: true,
  selector: 'app-tic-tac-toe',
  styleUrl: './tic-tac-toe.component.scss',
  templateUrl: './tic-tac-toe.component.html',
})
export class TicTacToeComponent {
  mode: GameMode = 'computer';
  squares: Square[] = Array(9).fill(null);
  xIsNext = true;
  winner: GameResult = null;

  get currentPlayer(): Player {
    return this.xIsNext ? 'X' : 'O';
  }

  setMode(mode: GameMode): void {
    this.mode = mode;
    this.newGame();
  }

  newGame(): void {
    this.squares = Array(9).fill(null);
    this.xIsNext = true;
    this.winner = null;
  }

  makeMove(index: number): void {
    if (
      this.winner ||
      !Number.isInteger(index) ||
      index < 0 ||
      index >= this.squares.length ||
      this.squares[index] !== null
    ) {
      return;
    }

    const player = this.currentPlayer;
    if (this.mode === 'computer' && player === COMPUTER) {
      return;
    }

    this.squares[index] = player;
    this.xIsNext = !this.xIsNext;
    this.winner = this.calculateWinner();

    if (this.winner || this.mode === 'two-players') {
      return;
    }

    const computerMove = this.findBestMove();
    if (computerMove !== -1) {
      this.squares[computerMove] = COMPUTER;
      this.xIsNext = true;
      this.winner = this.calculateWinner();
    }
  }

  calculateWinner(): GameResult {
    return this.getWinner(this.squares);
  }

  private findBestMove(): number {
    let bestMove = -1;
    let bestScore = Number.NEGATIVE_INFINITY;

    for (let index = 0; index < this.squares.length; index++) {
      if (this.squares[index] !== null) {
        continue;
      }

      this.squares[index] = COMPUTER;
      const score = this.minimax(this.squares, false, 0);
      this.squares[index] = null;

      if (score > bestScore) {
        bestScore = score;
        bestMove = index;
      }
    }

    return bestMove;
  }

  private minimax(board: Square[], isComputerTurn: boolean, depth: number): number {
    const result = this.getWinner(board);
    if (result === COMPUTER) {
      return 10 - depth;
    }
    if (result === HUMAN) {
      return depth - 10;
    }
    if (result === 'Draw') {
      return 0;
    }

    let bestScore = isComputerTurn ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
    const nextPlayer = isComputerTurn ? COMPUTER : HUMAN;

    for (let index = 0; index < board.length; index++) {
      if (board[index] !== null) {
        continue;
      }

      board[index] = nextPlayer;
      const score = this.minimax(board, !isComputerTurn, depth + 1);
      board[index] = null;

      bestScore = isComputerTurn
        ? Math.max(bestScore, score)
        : Math.min(bestScore, score);
    }

    return bestScore;
  }

  private getWinner(board: Square[]): GameResult {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const [a, b, c] of lines) {
      if (
        board[a] !== null &&
        board[a] === board[b] &&
        board[a] === board[c]
      ) {
        return board[a];
      }
    }

    if (board.every((square) => square !== null)) {
      return 'Draw';
    }

    return null;
  }
}
