import React, { CSSProperties, useMemo } from "react";
import clsx from "clsx";

import {
  Animation,
  AnimationMerge,
  AnimationMove,
  AnimationNew,
  AnimationType,
} from "../types/Animations";
import { Direction } from "../types/Direction";
import { animationDuration, gridGap } from "../config";

export interface BoardTileProps {
  value: number;
  animations?: Animation[];
}

function tileTranslate(axis: "X" | "Y", value: number) {
  return `translate${axis}(calc(${value} * (${gridGap} + 100%))`;
}

function findAnimation<T extends Animation>(
  animations: Animation[] | undefined,
  type: AnimationType
): T {
  return animations?.find((animation) => animation.type === type) as T;
}

function renderTileContent(value: number): React.ReactNode {
  switch (value) {
    case 1:
      return (
        <svg
          className="tile-shape tile-shape-triangle"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            d="M 50,15.3 L 8,88 L 92,88 Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="9"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      );
    case 2:
      return <span className="tile-shape tile-shape-square">■</span>;
    case 3:
      return (
        <svg
          className="tile-shape tile-shape-pentagon"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            d="M 50,10 L 88.04,37.64 L 73.51,82.36 L 26.49,82.36 L 11.96,37.64 Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="9"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      );
    case 4:
      return (
        <svg
          className="tile-shape tile-shape-hexagon"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            d="M 50,10 L 84.64,30 L 84.64,70 L 50,90 L 15.36,70 L 15.36,30 Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="9"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return value;
  }
}

const BoardTile: React.FC<BoardTileProps> = ({ value, animations }) => {
  const moveAnimation = useMemo(
    () => findAnimation<AnimationMove>(animations, AnimationType.MOVE),
    [animations]
  );
  const newAnimation = useMemo(
    () => findAnimation<AnimationNew>(animations, AnimationType.NEW),
    [animations]
  );
  const mergeAnimation = useMemo(
    () => findAnimation<AnimationMerge>(animations, AnimationType.MERGE),
    [animations]
  );

  const style = useMemo(() => {
    if (!moveAnimation) {
      return {};
    }

    const value: CSSProperties = {
      transition: animationDuration + "ms ease-in-out all",
    };

    switch (moveAnimation.direction) {
      case Direction.UP:
        value.transform = tileTranslate("Y", -1 * moveAnimation.value);
        break;
      case Direction.DOWN:
        value.transform = tileTranslate("Y", moveAnimation.value);
        break;
      case Direction.LEFT:
        value.transform = tileTranslate("X", -1 * moveAnimation.value);
        break;
      case Direction.RIGHT:
        value.transform = tileTranslate("X", moveAnimation.value);
        break;
    }

    return value;
  }, [moveAnimation]);

  return (
    <div className="board-tile">
      {value !== 0 && (
        <div
          className={clsx("board-tile-value", "board-tile-" + value, {
            "board-tile-new": !!newAnimation,
            "board-tile-merge": !!mergeAnimation,
          })}
          style={style}
        >
          {renderTileContent(value)}
        </div>
      )}
    </div>
  );
};

export default BoardTile;
