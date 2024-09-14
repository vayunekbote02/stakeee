import { useState, useEffect } from "react";

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
      setCoins(coins + bet * 2);
      setGameResult("win");
      setGamesPlayed(gamesPlayed + 1);
      setGameStarted(false);
      setMainStart(false);
    } else if (newClickedSquares.length === 8) {
      setGameResult("lose");
      setBet(coins < bet ? coins : bet);
      setGamesPlayed(gamesPlayed + 1);
      setGameStarted(false);
      setMainStart(false);
    }
  };

  const renderSquares = () => {
    return Array(16)
      .fill(null)
      .map((_, index) => (
        <div
          key={index}
          className={`w-16 h-16 border border-gray-300 cursor-pointer transition-colors duration-200 ${
            !clickedSquares.includes(index)
              ? "bg-gray-200 hover:bg-gray-300"
              : index === winningSquare
              ? "bg-green-500"
              : "bg-red-500"
          } ${
            !gameStarted &&
            "border-gray-300 hover:bg-gray-200 cursor-not-allowed"
          }`}
          onClick={() => handleSquareClick(index)}
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
    <div className="max-w-md p-6 mx-auto bg-white rounded-lg shadow-md">
      <h1 className="mb-6 text-3xl font-bold text-center">
        Square Betting Game
      </h1>
      <div className="mb-6 space-y-4">
        <p className="text-lg font-semibold">In your purse: ${coins}</p>
        {bet > 0 && <p className="text-lg">Current bet placed: ${bet}</p>}
        <p className="text-lg">Games Played: {gamesPlayed}</p>
        <p className="text-lg">Highest purse value of all time: ${highScore}</p>
        <p className="text-sm">
          Current game: (Highest Purse: ${highestPurse}, Lowest Purse: $
          {lowestPurse})
        </p>
      </div>
      <div className="mb-6">
        {mainStart && !gameStarted ? (
          <div className="flex flex-col space-y-4">
            <div>
              <label
                htmlFor="bet_input"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Please place your bet
              </label>
              <input
                type="number"
                name="bet_input"
                value={coins < tempBet ? coins : tempBet}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your bet"
              />
            </div>
            <button
              onClick={startGame}
              disabled={gameStarted || bet <= 0 || bet > coins}
              className="w-full px-4 py-2 text-white transition-colors duration-200 bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Start Game
            </button>
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            <button
              onClick={mainStartandPlayAgain}
              className={`w-full px-4 py-2 ${
                gameStarted
                  ? "bg-gray-500"
                  : "text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              } transition-colors duration-200  rounded-md `}
              disabled={gameStarted}
            >
              {gamesPlayed == 0 && !gameStarted ? "Start Game" : "Play Again"}
            </button>
            {gamesPlayed > 4 && !gameStarted ? (
              <button
                onClick={() => checkOutModalToggle()}
                className="w-full px-4 py-2 text-white transition-colors duration-200 bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              >
                Checkout
              </button>
            ) : (
              <></>
            )}
          </div>
        )}
        {gameStarted && (
          <p className="mt-4 font-medium text-center text-gray-700">
            Try to find the winning square.
          </p>
        )}
      </div>
      {gameResult && (
        <div
          className={`p-4 mb-6 rounded-md ${
            gameResult === "win"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          <h3 className="mb-2 text-lg font-bold">
            {gameResult === "win" ? "Congratulations!" : "Game Over"}
          </h3>
          <p>
            {gameResult === "win"
              ? `You won! You earned ${bet * 2} coins.`
              : `You lost ${tempBet} coins. Better luck next time!`}
          </p>
        </div>
      )}
      <div className="grid grid-cols-4 gap-2 mx-auto w-72">
        {renderSquares()}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-sm p-6 bg-white rounded-lg">
            <h2 className="mb-4 text-xl font-bold">
              {modalContent === "checkout" ? "Checkout" : "Game Over"}
            </h2>
            <p className="mb-6">
              {modalContent === "checkout"
                ? `You've played ${gamesPlayed} games. Would you like to cash out with $${coins}?`
                : "You've run out of coins. Would you like to start a new game?"}
            </p>
            <div className="flex justify-end space-x-4">
              {modalContent === "checkout" && (
                <button
                  onClick={handleContinuePlaying}
                  className="px-4 py-2 text-gray-700 transition-colors duration-200 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                >
                  Continue Playing
                </button>
              )}
              <button
                onClick={
                  modalContent === "checkout" ? handleCheckout : handleEndGame
                }
                className="px-4 py-2 text-white transition-colors duration-200 bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                {modalContent === "checkout" ? "Cash Out" : "New Game"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainGame;

// Check highest purse logic
