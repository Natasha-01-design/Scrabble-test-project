import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ScrabbleBoard from "../components/ScrabbleBoard";
import TileRack from "../components/TileRack";
import WordValidator from "../components/WordValidator";
import generateBag from "../components/TileBag";
import "../components/scrabble-style.css";
import isWordValid from "../components/index";


const BONUS_TEMPLATE = [
  ["TW", "", "", "DL", "", "", "", "TW", "", "", "", "DL", "", "", "TW"],
  ["", "DW", "", "", "", "TL", "", "", "", "TL", "", "", "", "DW", ""],
  ["", "", "DW", "", "", "", "DL", "", "DL", "", "", "", "DW", "", ""],
  ["DL", "", "", "DW", "", "", "", "DL", "", "", "", "DW", "", "", "DL"],
  ["", "", "", "", "DW", "", "", "", "", "", "DW", "", "", "", ""],
  ["", "TL", "", "", "", "TL", "", "", "", "TL", "", "", "", "TL", ""],
  ["", "", "DL", "", "", "", "DL", "", "DL", "", "", "", "DL", "", ""],
  ["TW", "", "", "DL", "", "", "", "*", "", "", "", "DL", "", "", "TW"],
  ["", "", "DL", "", "", "", "DL", "", "DL", "", "", "", "DL", "", ""],
  ["", "TL", "", "", "", "TL", "", "", "", "TL", "", "", "", "TL", ""],
  ["", "", "", "", "DW", "", "", "", "", "", "DW", "", "", "", ""],
  ["DL", "", "", "DW", "", "", "", "DL", "", "", "", "DW", "", "", "DL"],
  ["", "", "DW", "", "", "", "DL", "", "DL", "", "", "", "DW", "", ""],
  ["", "DW", "", "", "", "TL", "", "", "", "TL", "", "", "", "DW", ""],
  ["TW", "", "", "DL", "", "", "", "TW", "", "", "", "DL", "", "", "TW"],
];

const generateEmptyBoard = () => {
  return BONUS_TEMPLATE.map((row) =>
    row.map((bonus) => ({ tile: null, bonus: bonus || null }))
  );
};

const getInitialPlayers = (mode) => {
  if (mode === 'computer') {
    return [
      { name: "Human", score: 0, rack: [] },
      { name: "Computer", score: 0, rack: [] },
    ];
  }
  return [
    { name: "User1", score: 0, rack: [] },
    { name: "User2", score: 0, rack: [] },
  ];
};

function Game() {
  const navigate = useNavigate();
  const location = useLocation();
  const mode = location.state?.mode || 'human';
  const [players, setPlayers] = useState(() => getInitialPlayers(mode));
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(() => mode === 'computer' ? 1 : 0);
  const [turnCounts, setTurnCounts] = useState([0, 0]);
  const [board, setBoard] = useState(generateEmptyBoard());
  const [tileBag, setTileBag] = useState(generateBag());
  const [wordScore, setWordScore] = useState(0);
  const [selectedTile, setSelectedTile] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [computerThinking, setComputerThinking] = useState(false);
  const [user, setUser] = useState(null);
  const MAX_TURNS = 2;

  const currentPlayer = players[currentPlayerIndex];

  useEffect(() => {
    const checkSessionAndLoadGame = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5555/check_session', {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);

          // Load ongoing game
          const loadResponse = await fetch('http://127.0.0.1:5555/load_game', {
            method: 'GET',
            credentials: 'include',
          });
          if (loadResponse.ok) {
            const gameData = await loadResponse.json();
            const gameState = gameData.game_state;
            setBoard(gameState.board);
            setPlayers(gameState.players);
            setCurrentPlayerIndex(gameState.currentPlayerIndex);
            setTurnCounts(gameState.turnCounts);
            setTileBag(gameState.tileBag);
            setWordScore(gameState.wordScore);
            setTimeLeft(gameState.timeLeft);
          } else {
            // No saved game, fill racks
            setPlayers((prevPlayers) =>
              prevPlayers.map((player) => ({
                ...player,
                rack: tileBag.splice(0, 7),
              }))
            );
            setTileBag([...tileBag]);
          }
        } else {
          // Not logged in, fill racks
          setPlayers((prevPlayers) =>
            prevPlayers.map((player) => ({
              ...player,
              rack: tileBag.splice(0, 7),
            }))
          );
          setTileBag([...tileBag]);
        }
      } catch (error) {
        console.error('Error checking session or loading game:', error);
        // Fallback, fill racks
        setPlayers((prevPlayers) =>
          prevPlayers.map((player) => ({
            ...player,
            rack: tileBag.splice(0, 7),
          }))
        );
        setTileBag([...tileBag]);
      }
    };

    checkSessionAndLoadGame();
  }, []);

  useEffect(() => {
    if (currentPlayer.name === 'Computer') return; // No timer for computer
    if (timeLeft <= 0) {
      handlePass();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, currentPlayer.name]);

  const twoLetterWords = ["AT", "TO", "IN", "ON", "IT", "IS", "AS", "BE", "BY", "DO", "GO", "HE", "HI", "IF", "ME", "MY", "NO", "OF", "OH", "OR", "SO", "UP", "US", "WE"];

const validateAndCommitMove = async () => {
  // Clear isNew flags on tiles
  setBoard((prevBoard) =>
    prevBoard.map((row) =>
      row.map((cell) => {
        if (cell.tile?.isNew) {
          const newTile = { ...cell.tile };
          delete newTile.isNew;
          return { ...cell, tile: newTile };
        }
        return cell;
      })
    )
  );

  setSelectedTile(null);
  setTimeLeft(60);
  handleTurnAdvance();
};

const aiPlay = async () => {
  const rackLetters = currentPlayer.rack.map(t => t.letter);
  console.log("Computer rack:", rackLetters);

  // Determine if first move
  const isFirstMove = board.every((row) =>
    row.every((cell) => !cell.tile || cell.tile?.isNew)
  );

  if (isFirstMove) {
    // Place at center
    if (board[7][7].tile === null && board[7][8].tile === null) {
      // Try all 2-letter combinations
      for (let i = 0; i < rackLetters.length; i++) {
        for (let j = i + 1; j < rackLetters.length; j++) {
          const word = rackLetters[i] + rackLetters[j];

          // ✅ Check dictionary API
          const isValid = await isWordValid(word.toLowerCase());
          if (isValid) {
            console.log("Computer chooses word:", word);

            const tile1 = currentPlayer.rack[i];
            const tile2 = currentPlayer.rack[j];

            // Place word horizontally at center
            const newBoard = board.map((row, rIdx) =>
              row.map((cell, cIdx) => {
                if (rIdx === 7 && cIdx === 7) return { ...cell, tile: { ...tile1, isNew: true } };
                if (rIdx === 7 && cIdx === 8) return { ...cell, tile: { ...tile2, isNew: true } };
                return { ...cell };
              })
            );
            setBoard(newBoard);

            // Calculate score
            let totalScore = 0;
            let wordMultiplier = 1;
            const placedCells = [
              { row: 7, col: 7, tile: tile1 },
              { row: 7, col: 8, tile: tile2 }
            ];
            placedCells.forEach(({ row, col, tile }) => {
              const bonus = BONUS_TEMPLATE[row][col];
              if (bonus === "DL") totalScore += tile.value * 2;
              else if (bonus === "TL") totalScore += tile.value * 3;
              else totalScore += tile.value;
              if (bonus === "DW") wordMultiplier *= 2;
              if (bonus === "TW") wordMultiplier *= 3;
            });
            const finalScore = totalScore * wordMultiplier;
            setPlayers(prev => {
              const updated = [...prev];
              updated[currentPlayerIndex].score += finalScore;
              return updated;
            });
            setWordScore(finalScore);

            // Remove tiles from rack
            const newRack = currentPlayer.rack.filter(
              (t, idx) => idx !== i && idx !== j
            );

            // Update players
            setPlayers(prev => {
              const updated = [...prev];
              updated[currentPlayerIndex] = {
                ...updated[currentPlayerIndex],
                rack: newRack,
              };
              return updated;
            });

            // Refill rack
            setTileBag(prevBag => {
              const updatedBag = [...prevBag];
              const rackWithRefills = [...newRack];
              while (rackWithRefills.length < 7 && updatedBag.length > 0) {
                rackWithRefills.push(updatedBag.pop());
              }

              setPlayers(prev => {
                const updated = [...prev];
                updated[currentPlayerIndex] = {
                  ...updated[currentPlayerIndex],
                  rack: rackWithRefills,
                };
                return updated;
              });

              return updatedBag;
            });

            await validateAndCommitMove();
            return;
          }
        }
      }
    }
  } else {
    // For later moves, try to find empty positions
    for (let row = 0; row < 15; row++) {
      for (let col = 0; col < 14; col++) {
        if (board[row][col].tile === null && board[row][col + 1].tile === null) {
          // Try all 2-letter combinations
          for (let i = 0; i < rackLetters.length; i++) {
            for (let j = i + 1; j < rackLetters.length; j++) {
              const word = rackLetters[i] + rackLetters[j];

              // ✅ Check dictionary API
              const isValid = await isWordValid(word.toLowerCase());
              if (isValid) {
                console.log("Computer chooses word:", word, "at", row, col);

                const tile1 = currentPlayer.rack[i];
                const tile2 = currentPlayer.rack[j];

                // Place word horizontally
                const newBoard = board.map((r, rIdx) =>
                  r.map((cell, cIdx) => {
                    if (rIdx === row && cIdx === col) return { ...cell, tile: { ...tile1, isNew: true } };
                    if (rIdx === row && cIdx === col + 1) return { ...cell, tile: { ...tile2, isNew: true } };
                    return { ...cell };
                  })
                );
                setBoard(newBoard);

                // Calculate score
                let totalScore = 0;
                let wordMultiplier = 1;
                const placedCells = [
                  { row: row, col: col, tile: tile1 },
                  { row: row, col: col + 1, tile: tile2 }
                ];
                placedCells.forEach(({ row: r, col: c, tile }) => {
                  const bonus = BONUS_TEMPLATE[r][c];
                  if (bonus === "DL") totalScore += tile.value * 2;
                  else if (bonus === "TL") totalScore += tile.value * 3;
                  else totalScore += tile.value;
                  if (bonus === "DW") wordMultiplier *= 2;
                  if (bonus === "TW") wordMultiplier *= 3;
                });
                const finalScore = totalScore * wordMultiplier;
                setPlayers(prev => {
                  const updated = [...prev];
                  updated[currentPlayerIndex].score += finalScore;
                  return updated;
                });
                setWordScore(finalScore);

                // Remove tiles from rack
                const newRack = currentPlayer.rack.filter(
                  (t, idx) => idx !== i && idx !== j
                );

                // Update players
                setPlayers(prev => {
                  const updated = [...prev];
                  updated[currentPlayerIndex] = {
                    ...updated[currentPlayerIndex],
                    rack: newRack,
                  };
                  return updated;
                });

                // Refill rack
                setTileBag(prevBag => {
                  const updatedBag = [...prevBag];
                  const rackWithRefills = [...newRack];
                  while (rackWithRefills.length < 7 && updatedBag.length > 0) {
                    rackWithRefills.push(updatedBag.pop());
                  }

                  setPlayers(prev => {
                    const updated = [...prev];
                    updated[currentPlayerIndex] = {
                      ...updated[currentPlayerIndex],
                      rack: rackWithRefills,
                    };
                    return updated;
                  });

                  return updatedBag;
                });

                await validateAndCommitMove();
                return;
              }
            }
          }
        }
      }
    }
  }

  // If no valid word found → pass
  console.log("Computer passes");
  handlePass();
};

  useEffect(() => {
    if (currentPlayer.name === 'Computer' && !computerThinking) {
      setComputerThinking(true);
      // Simulate AI thinking
      setTimeout(() => {
        aiPlay();
        setComputerThinking(false);
      }, 1000);
    }
  }, [currentPlayerIndex]);

  const handleTurnAdvance = async () => {
    const newTurnCounts = [...turnCounts];
    newTurnCounts[currentPlayerIndex] += 1;

    // Save game state to backend
    if (user) {
      const gameState = {
        board,
        players,
        currentPlayerIndex,
        turnCounts: newTurnCounts,
        tileBag,
        wordScore,
        timeLeft,
      };
      try {
        await fetch('http://127.0.0.1:5555/save_game', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            game_state: gameState,
            opponent_type: mode === 'computer' ? 'computer' : 'human',
            opponent_name: mode === 'computer' ? 'Computer' : null,
            status: 'ongoing',
          }),
        });
      } catch (error) {
        console.error('Error saving game:', error);
      }
    }

    if (newTurnCounts[0] >= MAX_TURNS && newTurnCounts[1] >= MAX_TURNS) {
      const [p1, p2] = players;
      const winner =
        p1.score > p2.score
          ? p1.name
          : p2.score > p1.score
          ? p2.name
          : "It's a tie!";

      // Mark game as completed
      if (user) {
        try {
          await fetch('http://127.0.0.1:5555/complete_game', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ game_id: user.currentGameId }),
          });
        } catch (error) {
          console.error('Error completing game:', error);
        }
      }

      navigate("/winner", {
        state: { players, winner },
      });
      return;
    }

    setTurnCounts(newTurnCounts);
    setCurrentPlayerIndex((currentPlayerIndex + 1) % 2);
    setTimeLeft(60);
  };

  const handlePass = () => {
    setSelectedTile(null);
    handleTurnAdvance();
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5555/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        navigate("/");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handlePlay = async () => {
    // In a real game, you would validate the word and calculate the score
    // For now, this is a placeholder
    handleTurnAdvance();
  };

  return (
    <div className="game-container">
      <div className="game-info">
        <h2>{`Turn: ${currentPlayer.name}`}</h2>
        <h3>{`Score: ${currentPlayer.score}`}</h3>
        <h4>{`Time Left: ${timeLeft}s`}</h4>
      </div>
      <div className="board-and-rack-container">
        <ScrabbleBoard
          board={board}
          setBoard={setBoard}
          selectedTile={selectedTile}
          setSelectedTile={setSelectedTile}
          players={players}
          setPlayers={setPlayers}
          currentPlayerIndex={currentPlayerIndex}
        />
        <TileRack
          player={currentPlayer}
          selectedTile={selectedTile}
          setSelectedTile={setSelectedTile}
        />
      </div>

      <div className="sidebar">
        <h2>{currentPlayer.name}'s Turn</h2>
        <p>Score: {currentPlayer.score}</p>
        <p>Word Score: {wordScore}</p>
        <p>
          Timer:{" "}
          {Math.floor(timeLeft / 60)
            .toString()
            .padStart(2, "0")}
          :{(timeLeft % 60).toString().padStart(2, "0")}
        </p>

        <WordValidator
          board={board}
          setBoard={setBoard}
          currentPlayer={currentPlayer}
          setPlayers={setPlayers}
          currentPlayerIndex={currentPlayerIndex}
          setCurrentPlayerIndex={setCurrentPlayerIndex}
          setWordScore={setWordScore}
          tileBag={tileBag}
          setTileBag={setTileBag}
          setSelectedTile={setSelectedTile}
          setTimeLeft={setTimeLeft}
          handleTurnAdvance={handleTurnAdvance}
        >
          {({ playWord }) => (
            <button className="play-button" onClick={playWord}>
              Play Word
            </button>
          )}
        </WordValidator>
        <button className="pass-button" onClick={handlePass}>
          Pass
        </button>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Game;
