import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MainGame = () => {
  const [coins, setCoins] = useState(100);
  const [bet, setBet] = useState(0);
  const [tempBet, setTempBet] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [winningSquare, setWinningSquare] = useState(null);
  const [clickedSquares, setClickedSquares] = useState([]);
  const [gameResult, setGameResult] = useState(null);
  const [mainStart, setMainStart] = useState(false);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [highScore, setHighScore] = useState(
    parseInt(localStorage.getItem("highScore"), 10) || 100
  );
  const [highestPurse, setHighestPurse] = useState(100);
  const [lowestPurse, setLowestPurse] = useState(100);

  useEffect(() => {
    if (gameStarted) {
      setWinningSquare(Math.floor(Math.random() * 16));
    }
  }, [gameStarted]);

  useEffect(() => {
    if (gameResult) {
      if (gameResult === "win") {
        toast.success(`You won! You earned $${bet * 2} coins.`, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        toast.error(`You lost $${tempBet} coins. Better luck next time!`, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    }
  }, [gameResult]);

  useEffect(() => {
    if (coins < lowestPurse) {
      setLowestPurse(coins);
    }
    if (coins > highestPurse) {
      setHighestPurse(coins);
    }
    if (coins > highScore) {
      setHighScore(coins);
      localStorage.setItem("highScore", coins);
    }
  }, [coins, lowestPurse, highestPurse, highScore]);

  useEffect(() => {
    if (coins <= 0 && gameResult == "lose") {
      setModalContent("endgame");
      setShowModal(true);
    }
  }, [coins, gameResult]);

  const startGame = () => {
    if (bet > 0 && bet <= coins) {
      setGameStarted(true);
      setCoins(coins - bet);
      setClickedSquares([]);
      setGameResult(null);
    }
  };

  const handleSquareClick = (index) => {
    if (!gameStarted || clickedSquares.includes(index)) return;

    const newClickedSquares = [...clickedSquares, index];
    setClickedSquares(newClickedSquares);

    if (index === winningSquare) {
      setGameResult("win");
      setTimeout(() => {
        setCoins(coins + bet * 2);
        setGamesPlayed(gamesPlayed + 1);
        setGameStarted(false);
        setClickedSquares([]);
        setMainStart(false);
      }, 2000);
    } else if (newClickedSquares.length === 8) {
      setGameResult("lose");
      setTimeout(() => {
        setBet(coins < bet ? coins : bet);
        setGamesPlayed(gamesPlayed + 1);
        setGameStarted(false);
        setClickedSquares([]);
        setTempBet(coins);
        setMainStart(false);
      }, 1000);
    }
  };

  const renderSquares = () => {
    return Array(16)
      .fill(null)
      .map((_, index) => (
        <motion.div
          key={index}
          className={`w-16 h-16 border-2 border-gray-300 cursor-pointer rounded-lg shadow-md ${
            !clickedSquares.includes(index)
              ? "bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700"
              : index === winningSquare && gameResult === "win"
              ? "bg-gradient-to-br from-green-400 to-green-600"
              : "bg-gradient-to-br from-red-400 to-red-600"
          } ${
            !gameStarted &&
            "border-gray-300 hover:from-blue-400 hover:to-blue-600 cursor-not-allowed"
          }`}
          onClick={() => handleSquareClick(index)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.2 }}
        />
      ));
  };

  const mainStartandPlayAgain = () => {
    setMainStart(true);
    setGameResult(null);
    setClickedSquares([]);
  };

  const handleChange = (e) => {
    setBet(parseInt(e.target.value, 10));
    setTempBet(parseInt(e.target.value, 10));
  };

  const handleCheckout = () => {
    alert(`Congratulations! You're cashing out with $${coins}`);
    if (coins > highScore) {
      setHighScore(coins);
      localStorage.setItem("highScore", coins);
    }
    setCoins(100);
    setHighestPurse(100);
    setLowestPurse(100);
    setGamesPlayed(0);
    setBet(0);
    setGameResult(null);
    setClickedSquares([]);
    setGameStarted(true);
    setShowModal(false);
  };

  const checkOutModalToggle = () => {
    setModalContent("checkout");
    setShowModal(true);
  };

  const handleEndGame = () => {
    alert("Game over! You've run out of coins. Starting a new game.");
    setCoins(100);
    setTempBet(0);
    setHighestPurse(100);
    setLowestPurse(100);
    setGamesPlayed(0);
    setMainStart(false);
    setGameResult(null);
    setClickedSquares([]);
    setShowModal(false);
  };

  const handleContinuePlaying = () => {
    setShowModal(false);
  };

  return (
    <div className="h-full bg-gradient-to-t from-white to-purple-200">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="max-w-md p-8 mx-auto text-white rounded-lg shadow-lg bg-gradient-to-br from-purple-700 to-indigo-400"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 text-4xl font-extrabold text-center font-nunito"
        >
          Stake Lite
        </motion.h1>
        <div className="p-3 mb-4 text-indigo-600 bg-indigo-100 rounded-md shadow-lg font-nunito">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 space-y-4"
          >
            <p className="text-lg font-semibold ">In your purse: ${coins}</p>
            {bet > 0 && <p className="text-lg ">Current bet placed: ${bet}</p>}
            <p className="text-lg ">Games Played: {gamesPlayed}</p>
            <p className="text-lg ">
              Highest purse value of all time: ${highScore}
            </p>
            <p className="text-sm ">
              Current game: (Highest Purse: ${highestPurse}, Lowest Purse: $
              {lowestPurse})
            </p>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          {mainStart && !gameStarted ? (
            <div className="flex flex-col space-y-4">
              <div>
                <label
                  htmlFor="bet_input"
                  className="block mb-1 text-sm font-medium "
                >
                  Please place your bet
                </label>
                <input
                  type="number"
                  name="bet_input"
                  value={tempBet}
                  onChange={handleChange}
                  className="w-full p-2 text-black border-2 border-indigo-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your bet"
                />
              </div>
              <motion.button
                onClick={startGame}
                disabled={gameStarted || bet <= 0 || bet > coins}
                className="w-full px-4 py-2 text-white transition-colors duration-200 border-dashed rounded-md bg-gradient-to-r from-indigo-700 to-purple-800 hover:from-indigo-800 hover:to-purple-900 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Game
              </motion.button>
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              <motion.button
                onClick={mainStartandPlayAgain}
                className={`w-full px-4 py-2 text-white transition-colors duration-200 rounded-md ${
                  gameStarted
                    ? "bg-gray-500"
                    : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                }`}
                disabled={gameStarted}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {gamesPlayed == 0 && !gameStarted ? "Start Game" : "Play Again"}
              </motion.button>
              {gamesPlayed > 4 && !gameStarted && (
                <motion.button
                  onClick={() => checkOutModalToggle()}
                  className="w-full px-4 py-2 text-white transition-colors duration-200 rounded-md bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Checkout
                </motion.button>
              )}
            </div>
          )}

          {gameStarted && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 font-medium text-center text-white"
            >
              Try to find the winning square.
            </motion.p>
          )}
        </motion.div>
        {/* <AnimatePresence>
          {gameResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`p-4 mb-6 rounded-md ${
                gameResult === "win"
                  ? "bg-gradient-to-br from-green-100 to-emerald-200 text-green-800"
                  : "bg-gradient-to-br from-red-100 to-rose-200 text-red-800"
              }`}
            >
              <h3 className="mb-2 text-lg font-bold">
                {gameResult === "win" ? "Congratulations!" : "Game Over"}
              </h3>
              <p>
                {gameResult === "win"
                  ? `You won! You earned $${bet * 2} coins.`
                  : `You lost $${tempBet} coins. Better luck next time!`}
              </p>
            </motion.div>
          )}
        </AnimatePresence> */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-4 gap-2 mx-auto w-72"
        >
          {renderSquares()}
        </motion.div>

        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            >
              <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                className="w-full max-w-sm p-6 bg-white rounded-lg shadow-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-indigo-800">
                    {modalContent === "checkout" ? "Checkout" : "Game Over"}
                  </h2>
                  <button
                    className="font-extrabold text-indigo-600"
                    onClick={handleContinuePlaying}
                  >
                    ╳
                  </button>
                </div>
                <p className="mb-6 text-indigo-700">
                  {modalContent === "checkout"
                    ? `You've played ${gamesPlayed} games. Would you like to cash out with $${coins}?`
                    : "You've run out of coins. Would you like to start a new game?"}
                </p>
                <div className="flex justify-end space-x-4">
                  {modalContent === "checkout" && (
                    <motion.button
                      onClick={handleContinuePlaying}
                      className="px-4 py-2 text-indigo-700 transition-colors duration-200 bg-indigo-100 rounded-md hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Continue Playing
                    </motion.button>
                  )}
                  <motion.button
                    onClick={
                      modalContent === "checkout"
                        ? handleCheckout
                        : handleEndGame
                    }
                    className="px-4 py-2 text-white transition-colors duration-200 rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {modalContent === "checkout" ? "Cash Out" : "New Game"}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <ToastContainer />
    </div>
  );
};

export default MainGame;

// Check highest purse logic
