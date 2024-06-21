import React, { useState, useEffect } from 'react';
import './App.css';

const colors = ['red', 'blue', 'yellow', 'green'];
const columns = 6;
const rows = 5;

const App = () => {
  const [activeColors, setActiveColors] = useState(
    Array(rows).fill(null).map(() => Array(columns).fill(null))
  );
  const [score, setScore] = useState(0);
  const [correctColor, setCorrectColor] = useState(null);
  const [synth, setSynth] = useState(null);
  const [gameOver, setGameOver] = useState(true);

  useEffect(() => {
    const newSynth = window.speechSynthesis;
    setSynth(newSynth);

    if (!gameOver) {
      const interval = setInterval(() => {
        const newActiveColors = activeColors.map(row =>
          row.map(() => colors[Math.floor(Math.random() * colors.length)])
        );
        setActiveColors(newActiveColors);

        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        setCorrectColor(randomColor);

        speakColor(randomColor);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [activeColors, gameOver]);

  const speakColor = color => {
    if (synth) {
      const utterance = new SpeechSynthesisUtterance(color);
      synth.speak(utterance);
    }
  };

  const handleCellClick = (rowIndex, columnIndex) => {
    if (gameOver) return;

    const clickedColor = activeColors[rowIndex][columnIndex];
    if (clickedColor) {
      if (clickedColor === correctColor) {
        setScore(score + 1);
      } else {
        setGameOver(true);
      }
    }
  };

  const handleRestart = () => {
    setGameOver(false);
    setScore(0);
  };

  return (
    <div className="App">
      <h1>Colour Pick Game</h1>
      {!gameOver && <h2>Score: {score}</h2>}
      {gameOver && (
        <div>
          <h2>Game Over</h2>
          <h3>Score: {score}</h3>
          <button onClick={handleRestart} className='start'>Start</button>
        </div>
      )}
      <div className="grid">
        {Array.from({ length: rows }).map((_, rowIndex) =>
          Array.from({ length: columns }).map((_, columnIndex) => (
            <div
              key={`${rowIndex}-${columnIndex}`}
              className={`cell ${activeColors[rowIndex][columnIndex]}`}
              onClick={() => handleCellClick(rowIndex, columnIndex)}
            ></div>
          ))
        )}
      </div>
    </div>
  );
};

export default App;
