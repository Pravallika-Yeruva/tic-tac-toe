import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TicTacToeComponent } from './tic-tac-toe.component';

describe('TicTacToeComponent', () => {
  let component: TicTacToeComponent;
  let fixture: ComponentFixture<TicTacToeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicTacToeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TicTacToeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should make a computer move after the player moves', () => {
    component.makeMove(0);

    expect(component.squares.filter((square) => square === 'X')).toHaveLength(1);
    expect(component.squares.filter((square) => square === 'O')).toHaveLength(1);
  });

  it('should block the player from completing a row', () => {
    component.makeMove(0);
    component.makeMove(1);

    expect(component.squares[2]).toBe('O');
    expect(component.winner).toBeNull();
  });

  it('should reset the board for a new game', () => {
    component.makeMove(0);
    component.newGame();

    expect(component.squares).toEqual(Array(9).fill(null));
    expect(component.winner).toBeNull();
  });

  it('should alternate players without a computer move in two-player mode', () => {
    component.setMode('two-players');
    component.makeMove(0);

    expect(component.squares[0]).toBe('X');
    expect(component.currentPlayer).toBe('O');
    expect(component.squares.filter((square) => square !== null)).toHaveLength(1);

    component.makeMove(1);

    expect(component.squares[1]).toBe('O');
    expect(component.currentPlayer).toBe('X');
  });

  it('should reset the board when switching modes', () => {
    component.makeMove(0);
    component.setMode('two-players');

    expect(component.mode).toBe('two-players');
    expect(component.squares).toEqual(Array(9).fill(null));
    expect(component.currentPlayer).toBe('X');
  });
});
