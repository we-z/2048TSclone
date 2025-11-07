import React, { CSSProperties, useMemo, useState, useEffect } from "react";
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
import ParticleEffect from "./ParticleEffect";

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
  // Loop numbers 1 through 8
  const displayNumber = ((value - 1) % 8) + 1;
  return displayNumber;
}

const BoardTile: React.FC<BoardTileProps> = ({ value, animations }) => {
  const [showParticles, setShowParticles] = useState(false);
  const [particleTileValue, setParticleTileValue] = useState(0);

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

  // Trigger particles AFTER merge animation completes - only for significant merges (value >= 5)
  useEffect(() => {
    if (mergeAnimation && mergeAnimation.value && mergeAnimation.value >= 5) {
      // Wait for the merge animation to complete before showing particles
      const timer = setTimeout(() => {
        setParticleTileValue(mergeAnimation.value || 0);
        setShowParticles(true);
      }, animationDuration);

      return () => clearTimeout(timer);
    }
  }, [mergeAnimation]);

  const style = useMemo(() => {
    if (!moveAnimation) {
      return {};
    }

    const value: CSSProperties = {
      transition: animationDuration + "ms ease-in-out transform",
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

  const displayNumber = useMemo(() => {
    return value !== 0 ? ((value - 1) % 8) + 1 : 0;
  }, [value]);

  return (
    <div className="board-tile">
      {value !== 0 && (
        <div
          className={clsx(
            "board-tile-value",
            "board-tile-display-" + displayNumber,
            {
              "board-tile-new": !!newAnimation,
              "board-tile-merge": !!mergeAnimation,
              // Progressive merge effects based on tile value
              [`board-tile-merge-level-${value}`]: !!mergeAnimation && value,
            }
          )}
          style={style}
        >
          <span
            className={clsx("tile-number", {
              "tile-number-merge": !!mergeAnimation,
              [`tile-number-merge-level-${value}`]: !!mergeAnimation && value,
            })}
          >
            {renderTileContent(value)}
          </span>
          {showParticles && (
            <ParticleEffect
              tileValue={particleTileValue}
              onComplete={() => setShowParticles(false)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default BoardTile;
