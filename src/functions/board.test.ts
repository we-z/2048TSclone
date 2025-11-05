import { Direction } from "../types/Direction";
import { initializeBoard, newTileValue, updateBoard } from "./board";

describe("board", () => {
  it("new tile value always returns 1 (triangle)", () => {
    expect(newTileValue()).toBe(1);
  });

  it("initializes board with two non-zero tiles", () => {
    const boardSize = 4;
    const update = initializeBoard(boardSize);
    expect(update.board.length).toBe(boardSize ** 2);
    expect(update.board.filter((value) => value === 0).length).toBe(
      boardSize ** 2 - 2
    );
  });

  it("moves tiles down", () => {
    const board = [0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0];
    const update = updateBoard(board, Direction.DOWN);
    expect(update.board[15]).toBe(3);
    expect(update.scoreIncrease).toBe(0);

    // Make sure a new tile is generated.
    expect(update.board.filter((value) => value !== 0).length).toBe(2);
  });

  it("moves tiles up", () => {
    const board = [0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0];
    const update = updateBoard(board, Direction.UP);
    expect(update.board[3]).toBe(2);
    expect(update.scoreIncrease).toBe(0);

    // Make sure a new tile is generated.
    expect(update.board.filter((value) => value !== 0).length).toBe(2);
  });

  it("moves tiles left", () => {
    const board = [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    const update = updateBoard(board, Direction.LEFT);
    expect(update.board[4]).toBe(1);
    expect(update.scoreIncrease).toBe(0);

    // Make sure a new tile is generated.
    expect(update.board.filter((value) => value !== 0).length).toBe(2);
  });

  it("moves tiles right", () => {
    const board = [0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const update = updateBoard(board, Direction.RIGHT);
    expect(update.board[7]).toBe(2);
    expect(update.scoreIncrease).toBe(0);

    // Make sure a new tile is generated.
    expect(update.board.filter((value) => value !== 0).length).toBe(2);
  });

  it("merges two tiles of value 1 to make 2", () => {
    const board = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1];
    const update = updateBoard(board, Direction.DOWN);
    expect(update.board[15]).toBe(2);
    expect(update.scoreIncrease).toBe(2);

    // Make sure a new tile is generated.
    expect(update.board.filter((value) => value !== 0).length).toBe(2);
  });

  it("merges two tiles of value 2 to make 3", () => {
    const board = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2];
    const update = updateBoard(board, Direction.DOWN);
    expect(update.board[15]).toBe(3);
    expect(update.scoreIncrease).toBe(3);

    // Make sure a new tile is generated.
    expect(update.board.filter((value) => value !== 0).length).toBe(2);
  });

  it("merges two tiles of value 3 to make 1", () => {
    const board = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 3];
    const update = updateBoard(board, Direction.DOWN);
    expect(update.board[15]).toBe(1);
    expect(update.scoreIncrease).toBe(1);

    // Make sure a new tile is generated.
    expect(update.board.filter((value) => value !== 0).length).toBe(2);
  });

  it("doesn't merge different tiles together", () => {
    const board = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 3];
    const update = updateBoard(board, Direction.DOWN);
    expect(update.board[15]).toBe(3);
    expect(update.board[11]).toBe(2);
    expect(update.scoreIncrease).toBe(0);

    // No new tile is generated because nothing moved.
    expect(update.board.filter((value) => value !== 0).length).toBe(2);
  });

  it("merges tiles in a non-greedy fashion: variant #1", () => {
    const board = [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1];
    const update = updateBoard(board, Direction.DOWN);
    expect(update.board[15]).toBe(2);
    expect(update.board[11]).toBe(2);
    expect(update.scoreIncrease).toBe(4); // 2 + 2

    // Make sure a new tile is generated.
    expect(update.board.filter((value) => value !== 0).length).toBe(3);
  });

  it("merges tiles in a non-greedy fashion: variant #2", () => {
    const board = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3];
    const update = updateBoard(board, Direction.RIGHT);
    expect(update.board[15]).toBe(1); // 3+3=1
    expect(update.board[14]).toBe(2);
    expect(update.scoreIncrease).toBe(1);

    // Make sure a new tile is generated.
    expect(update.board.filter((value) => value !== 0).length).toBe(3);
  });

  it("merges tiles in a non-greedy fashion: variant #3", () => {
    const board = [0, 0, 0, 1, 0, 3, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1];
    const update = updateBoard(board, Direction.DOWN);
    expect(update.board[13]).toBe(2); // 1+1=2

    // Make sure a new tile is generated.
    expect(update.board.filter((value) => value !== 0).length).toBe(5);
  });
});
