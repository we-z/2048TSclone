import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { StateType } from "../reducers";
import { Direction } from "../types/Direction";
import { BoardType } from "../functions/board";
import { Animation, AnimationType } from "../types/Animations";
import { animationDuration } from "../config";
import { moveAction } from "../actions";
import BoardTile from "./BoardTile";
import Overlay from "./Overlay";

const Board: React.FC = () => {
  const dispatch = useDispatch();
  const board = useSelector((state: StateType) => state.board);
  const boardSize = useSelector((state: StateType) => state.boardSize);
  const animations = useSelector((state: StateType) => state.animations);

  const onMove = useCallback(
    (direction: Direction) => dispatch(moveAction(direction)),
    [dispatch]
  );

  const [renderedBoard, setRenderedBoard] = useState(board);
  const [renderedAnimations, setRenderedAnimations] = useState<Animation[]>([]);
  const lastBoard = useRef<BoardType>([...board]);
  const animationTimeout = useRef<any>();

  useEffect(() => {
    const keydownListener = (e: KeyboardEvent) => {
      // Only handle arrow keys if no modifier keys are pressed
      // This allows browser shortcuts like Command+R to work
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) {
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          onMove(Direction.DOWN);
          break;
        case "ArrowUp":
          e.preventDefault();
          onMove(Direction.UP);
          break;
        case "ArrowLeft":
          e.preventDefault();
          onMove(Direction.LEFT);
          break;
        case "ArrowRight":
          e.preventDefault();
          onMove(Direction.RIGHT);
          break;
      }
    };

    window.addEventListener("keydown", keydownListener);

    return () => {
      window.removeEventListener("keydown", keydownListener);
    };
  }, [onMove]);

  useEffect(() => {
    // Store the previous board state before processing animations
    const previousBoard = [...lastBoard.current];

    // Update lastBoard.current to the current board state
    lastBoard.current = [...board];

    if (!animations) {
      setRenderedBoard([...board]);
      return;
    }

    const moveAnimations = animations.filter(
      (animation) => animation.type === AnimationType.MOVE
    );
    const otherAnimations = animations.filter(
      (animation) => animation.type !== AnimationType.MOVE
    );

    if (moveAnimations.length > 0) {
      setRenderedBoard(previousBoard);
      setRenderedAnimations(moveAnimations);

      clearTimeout(animationTimeout.current);
      animationTimeout.current = setTimeout(() => {
        setRenderedAnimations(otherAnimations);
        setRenderedBoard([...board]);
      }, animationDuration);
    } else {
      setRenderedAnimations(otherAnimations);
      setRenderedBoard([...board]);
    }
  }, [animations, board, setRenderedBoard, setRenderedAnimations]);

  return (
    <div
      className={`board board-${boardSize}`}
      style={{ "--board-size": boardSize } as any}
    >
      {renderedBoard.map((value, i) => (
        <BoardTile
          value={value}
          key={i}
          animations={renderedAnimations?.filter(
            (animation) => animation.index === i
          )}
        />
      ))}
      <Overlay />
    </div>
  );
};

export default Board;
