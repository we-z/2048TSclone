import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import "./App.scss";

import { animationDuration, gridGap } from "./config";
import { Direction } from "./types/Direction";
import { Point } from "./types/Models";
import { moveAction } from "./actions";
import Header from "./components/Header";
import Board from "./components/Board";
import Info from "./components/Info";
// import BoardSizePicker from "./components/BoardSizePicker";
import ThemeToggle from "./components/ThemeToggle";

const App: React.FC = () => {
  const dispatch = useDispatch();
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme === "dark" : true; // default to dark mode
  });
  const startPointerLocation = useRef<Point>();

  useEffect(() => {
    const theme = isDark ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [isDark]);

  // Prevent scrolling globally by preventing touchmove default behavior
  // But allow buttons and other interactive elements to work
  useEffect(() => {
    const preventDefault = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      // Allow buttons and other interactive elements to handle their own touch events
      if (
        target.tagName === "BUTTON" ||
        target.closest("button") ||
        target.closest("a") ||
        target.isContentEditable
      ) {
        return;
      }
      e.preventDefault();
    };

    // Prevent default touchmove behavior to disable scrolling
    document.addEventListener("touchmove", preventDefault, { passive: false });

    return () => {
      document.removeEventListener("touchmove", preventDefault);
    };
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const onMove = useCallback(
    (direction: Direction) => dispatch(moveAction(direction)),
    [dispatch]
  );

  const finishPointer = useCallback(
    (a: Point, b: Point) => {
      const distance = Math.sqrt((b.y - a.y) ** 2 + (b.x - a.x) ** 2);
      if (distance < 20) {
        return;
      }

      const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
      if (angle < -135 || angle > 135) {
        onMove(Direction.LEFT);
      } else if (angle < -45) {
        onMove(Direction.UP);
      } else if (angle < 45) {
        onMove(Direction.RIGHT);
      } else if (angle < 135) {
        onMove(Direction.DOWN);
      }
    },
    [onMove]
  );

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (touch) {
      const point: Point = { x: touch.pageX, y: touch.pageY };
      startPointerLocation.current = point;
    }
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      if (startPointerLocation.current) {
        const touch = e.changedTouches[0];
        if (touch) {
          finishPointer(startPointerLocation.current, {
            x: touch.pageX,
            y: touch.pageY,
          });
        }
        startPointerLocation.current = undefined;
      }
    },
    [finishPointer]
  );

  const onMouseStart = useCallback((e: React.MouseEvent) => {
    const point: Point = { x: e.pageX, y: e.pageY };
    startPointerLocation.current = point;
  }, []);

  const onMouseEnd = useCallback(
    (e: React.MouseEvent) => {
      if (startPointerLocation.current) {
        finishPointer(startPointerLocation.current, { x: e.pageX, y: e.pageY });
        startPointerLocation.current = undefined;
      }
    },
    [finishPointer]
  );

  return (
    <div
      className="app"
      style={
        {
          "--animation-duration": animationDuration + "ms",
          "--grid-gap": gridGap,
        } as any
      }
      onMouseDown={onMouseStart}
      onMouseUp={onMouseEnd}
      onMouseLeave={onMouseEnd}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
      <div className="page">
        <Header />
        <Board />
        {/* <BoardSizePicker /> */}
        <Info />
      </div>
    </div>
  );
};

export default App;
