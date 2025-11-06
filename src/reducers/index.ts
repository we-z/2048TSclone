import { Store } from "redux";

import { ActionType } from "../types/ActionType";
import { ActionModel } from "../types/Models";
import {
  initializeBoard,
  BoardType,
  updateBoard,
  movePossible,
} from "../functions/board";
import { Direction } from "../types/Direction";
import { getStoredData, setStoredData } from "../functions/localStorage";
import { Animation, AnimationType } from "../types/Animations";
import { defaultBoardSize, victoryTileValue } from "../config";

export interface StateType {
  /** Board size. Currently always 4. */
  boardSize: number;

  /** Current board. */
  board: BoardType;

  /** Previous board. */
  previousBoard?: BoardType;

  /** Previous direction of the last move. */
  previousDirection?: Direction;

  /** Was 2048 tile found? */
  victory: boolean;

  /** Is game over? */
  defeat: boolean;

  /** Should the victory screen be hidden? */
  victoryDismissed: boolean;

  /** Current score. */
  score: number;

  /** Score increase after last update. */
  scoreIncrease?: number;

  /** Best score. */
  best: number;

  /** Used for certain animations. Mainly as a value of the "key" property. */
  moveId?: string;

  /** Animations after last update. */
  animations?: Animation[];
}

const storedData = getStoredData();

function initializeState(): StateType {
  const update = initializeBoard(defaultBoardSize);

  return {
    boardSize: storedData.boardSize || defaultBoardSize,
    board: storedData.board || update.board,
    defeat: storedData.defeat || false,
    victory: false,
    victoryDismissed: storedData.victoryDismissed || false,
    score: storedData.score || 0,
    best: storedData.best || 0,
    moveId: new Date().getTime().toString(),
  };
}

let initialState: StateType = initializeState();

export type StoreType = Store<StateType, ActionModel>;

function applicationState(state = initialState, action: ActionModel) {
  const newState = { ...state };

  switch (action.type) {
    case ActionType.RESET:
      {
        const size = action.value || newState.boardSize;
        const update = initializeBoard(size);
        newState.boardSize = size;
        newState.board = update.board;
        newState.score = 0;
        newState.animations = update.animations;
        newState.previousBoard = undefined;
        newState.victory = false;
        newState.victoryDismissed = false;
      }
      break;
    case ActionType.MOVE:
      {
        if (newState.defeat) {
          break;
        }

        const direction = action.value as Direction;
        const update = updateBoard(newState.board, direction);

        // Only save previous state if the move actually changed the board
        if (update.changed) {
          newState.previousBoard = [...newState.board];
          newState.previousDirection = direction;
          newState.board = update.board;
          newState.score += update.scoreIncrease;
          newState.animations = update.animations;
          newState.scoreIncrease = update.scoreIncrease;
          newState.moveId = new Date().getTime().toString();
        }
      }
      break;
    case ActionType.UNDO:
      if (newState.defeat || !newState.previousBoard) {
        break;
      }

      // Store current board state and animations before changing board state
      const currentBoardBeforeUndo = [...newState.board];
      const storedAnimations = newState.animations;

      if (newState.scoreIncrease) {
        newState.score -= newState.scoreIncrease;
        newState.scoreIncrease = undefined;
      }

      // Generate reverse animations by reversing the stored forward animations
      // The stored animations show tiles moving from previousBoard to current board
      // We need to reverse them to show tiles moving back
      const reverseAnimations: Animation[] = [];
      if (newState.previousDirection && storedAnimations) {
        const boardSize = Math.sqrt(currentBoardBeforeUndo.length);

        // For each move animation, reverse it
        for (const anim of storedAnimations) {
          if (anim.type === AnimationType.MOVE) {
            // anim.index is where the tile started (in previousBoard)
            // We need to calculate where it ended up (in currentBoard)
            let sourceRow = Math.floor(anim.index / boardSize);
            let sourceCol = anim.index % boardSize;

            // Calculate destination based on direction and value
            switch (anim.direction) {
              case Direction.UP:
                sourceRow -= anim.value;
                break;
              case Direction.DOWN:
                sourceRow += anim.value;
                break;
              case Direction.LEFT:
                sourceCol -= anim.value;
                break;
              case Direction.RIGHT:
                sourceCol += anim.value;
                break;
            }

            const destIndex = sourceRow * boardSize + sourceCol;

            // Reverse the direction
            let reverseDirection: Direction;
            switch (anim.direction) {
              case Direction.UP:
                reverseDirection = Direction.DOWN;
                break;
              case Direction.DOWN:
                reverseDirection = Direction.UP;
                break;
              case Direction.LEFT:
                reverseDirection = Direction.RIGHT;
                break;
              case Direction.RIGHT:
                reverseDirection = Direction.LEFT;
                break;
            }

            // Create reverse animation: from destination (current position) back to source (previous position)
            reverseAnimations.push({
              type: AnimationType.MOVE,
              index: destIndex,
              direction: reverseDirection,
              value: anim.value,
            });
          } else if (anim.type === AnimationType.NEW) {
            // For NEW animations, we need to animate the tile disappearing
            // We'll handle this by creating a reverse animation that moves it out
            // Actually, NEW tiles should just disappear, so we might not need animation
            // But let's keep it simple and just not animate NEW tiles
          } else if (anim.type === AnimationType.MERGE) {
            // For MERGE animations, we need to reverse the merge
            // This is complex - we'd need to split the merged tile back
            // For now, let's just not animate merges on undo
            // The tile will just appear at its original position
          }
        }
      }

      // Restore previous board AFTER calculating animations
      // This way the Board component can animate from currentBoardBeforeUndo to previousBoard
      newState.board = newState.previousBoard;
      newState.previousBoard = undefined;

      // Set reverse animations or clear them
      newState.animations =
        reverseAnimations.length > 0 ? reverseAnimations : undefined;
      newState.previousDirection = undefined;
      newState.moveId = new Date().getTime().toString();
      break;
    case ActionType.DISMISS:
      newState.victoryDismissed = true;
      break;
    default:
      return state;
  }

  if (newState.score > newState.best) {
    newState.best = newState.score;
  }

  newState.defeat = !movePossible(newState.board);
  newState.victory =
    victoryTileValue > 0 &&
    !!newState.board.find((value) => value === victoryTileValue);
  setStoredData(newState);

  return newState;
}

export default applicationState;
