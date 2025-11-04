import React, { useEffect, useState } from "react";
import "./App.scss";

import { animationDuration, gridGap } from "./config";
import Header from "./components/Header";
import Board from "./components/Board";
import Info from "./components/Info";
import BoardSizePicker from "./components/BoardSizePicker";
import ThemeToggle from "./components/ThemeToggle";

const App: React.FC = () => {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme === "dark" : true; // default to dark mode
  });

  useEffect(() => {
    const theme = isDark ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <div
      className="app"
      style={
        {
          "--animation-duration": animationDuration + "ms",
          "--grid-gap": gridGap,
        } as any
      }
    >
      <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
      <div className="page">
        <Header />
        <Board />
        <BoardSizePicker />
        <Info />
      </div>
    </div>
  );
};

export default App;
