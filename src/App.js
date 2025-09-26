// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import PrivacyPolicy from './PrivacyPolicy';

// Dane gry
const gameData = [
  { haslo: "GYATT", podpowiedz: "Slangowe wołanie (najczęściej w kontekście wyglądu)" },
  { haslo: "DELULU", podpowiedz: "Skrót od delusional, oderwanie od rzeczywistości" },
  { haslo: "SIGMA", podpowiedz: "Archetyp samca alfa 2.0, memicznie przerysowany" },
  { haslo: "OHIO", podpowiedz: "Miejsce-mem" },
  { haslo: "NPC", podpowiedz: "Ktoś zachowujący się jak postać poboczna z gry" },
  { haslo: "SLAY", podpowiedz: "Świetnie wyglądać / robić coś dobrze" },
  { haslo: "VIBE CHECK", podpowiedz: "Szybka ocena czy coś/jakiś klimat pasuje" },
  { haslo: "SIMP", podpowiedz: "Ktoś, kto przesadnie adoruje" },
  { haslo: "GLOWUP", podpowiedz: "Przemiana na lepsze, zarówno wizualna, jak i stylu życia" },
  { haslo: "SUS", podpowiedz: "Podejrzane, z Among Us" },
  { haslo: "CRINGE", podpowiedz: "Coś żenującego" },
  { haslo: "OK BOOMER", podpowiedz: "Wyśmiewanie starszego pokolenia" },
  { haslo: "SHEESH", podpowiedz: "Wykrzyknik podkreślający podziw" },
  { haslo: "FLEX", podpowiedz: "Chwalenie się czymś" },
  { haslo: "POV", podpowiedz: "Punkt widzenia, narracja memiczna" },
  { haslo: "REL", podpowiedz: "Totalnie się utożsamiam" },
  { haslo: "UWU", podpowiedz: "Emotikon oznaczający coś ślicznego, uroczego, słodkiego lub gdy czujemy się szczególnie szczęśliwi" },
  { haslo: "BAMBIK", podpowiedz: "Nowicjusz w grze, łatwy do pokonania" },
  { haslo: "RANDOM", podpowiedz: "Przypadkowa osoba/sytuacja, bez kontekstu" },
  { haslo: "INBA", podpowiedz: "Konflikt, drama, coś grubo się dzieje" }
];

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// Komponent główny
function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [gameResult, setGameResult] = useState(null);

  // Zabezpieczenia
  useEffect(() => {
    // Blokada prawego przycisku myszy
    const handleContextMenu = (e) => {
      e.preventDefault();
    };
    
    // Blokada zaznaczania tekstu
    const handleSelectStart = (e) => {
      e.preventDefault();
    };
    
    // Blokada przeciągania
    const handleDragStart = (e) => {
      e.preventDefault();
    };

    // Dodaj event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('dragstart', handleDragStart);
    
    // Blokada kombinacji klawiszy (F12, Ctrl+Shift+I, etc.)
    const handleKeyDown = (e) => {
      // F12
      if (e.keyCode === 123) {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
      if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) {
        e.preventDefault();
        return false;
      }
      // Ctrl+U (view source)
      if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
        return false;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup - usuń event listeners przy odmontowaniu
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const startGame = () => {
    setCurrentScreen('game');
  };

  const endGame = (result) => {
    setGameResult(result);
    setCurrentScreen('home');
  };

  const showPrivacyPolicy = () => {
    setCurrentScreen('privacy');
  };

  const goHome = () => {
    setCurrentScreen('home');
  };

  return (
    <div className="app">
      {currentScreen === 'home' && <HomeScreen onStart={startGame} gameResult={gameResult} onPrivacy={showPrivacyPolicy} />}
      {currentScreen === 'game' && <GameScreen onEnd={endGame} onBack={goHome} />}
      {currentScreen === 'privacy' && <PrivacyPolicy onBack={goHome} />}
    </div>
  );
}

// Ekran główny
function HomeScreen({ onStart, gameResult, onPrivacy }) {
  return (
    <div className="home-screen">
      <div className="home-content">
        <h1 className="game-title">🔥 GRA SŁOWNA</h1>
        <h2 className="game-subtitle">SLANG EDITION 2024</h2>
        <p className="test-tagline">Sprawdź, czy jesteś młodzieżowy!</p>
        
        {gameResult && (
          <div className="last-result">
            <p>Ostatni wynik: {gameResult.score}/20</p>
            <p>Czas: {gameResult.time}</p>
          </div>
        )}
        
        <button className="play-button" onClick={onStart}>
          <span className="button-icon">▶</span>
          GRAJ
        </button>
      </div>
      
      <footer className="footer">
        <button className="privacy-link" onClick={onPrivacy}>
          Polityka prywatności
        </button>
      </footer>
    </div>
  );
}

// Ekran gry
function GameScreen({ onEnd, onBack }) {
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [guessedWord, setGuessedWord] = useState([]);
  const [letterUsageCount, setLetterUsageCount] = useState({});
  const [mistakes, setMistakes] = useState(0);
  const [score, setScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showDialog, setShowDialog] = useState(null);
  const [showExitDialog, setShowExitDialog] = useState(false);

  // Inicjalizacja
  useEffect(() => {
    const shuffled = [...gameData].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
  }, []);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  // Ładowanie pytania
  useEffect(() => {
    if (shuffledQuestions.length > 0) {
      const question = shuffledQuestions[currentQuestionIndex];
      // Tworzymy tablicę z uwzględnieniem spacji
      const initialGuess = question.haslo.split('').map(char => char === ' ' ? ' ' : '');
      setGuessedWord(initialGuess);
      setLetterUsageCount({});
      setMistakes(0);
      setHintsUsed(0);
    }
  }, [currentQuestionIndex, shuffledQuestions]);

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const currentQuestion = shuffledQuestions[currentQuestionIndex] || { haslo: '', podpowiedz: '' };

  const countLetterInWord = (letter) => {
    return currentQuestion.haslo.split('').filter(l => l === letter).length;
  };

  const getLetterButtonClass = (letter) => {
    const timesUsed = letterUsageCount[letter] || 0;
    const timesInWord = countLetterInWord(letter);
    
    if (timesUsed > 0) {
      if (timesInWord > 0) {
        // Litera została użyta i jest w słowie
        return 'letter-button letter-complete';
      } else {
        // Litera została użyta, ale nie ma jej w słowie (błąd)
        return 'letter-button letter-wrong';
      }
    }
    return 'letter-button';
  };

  const selectLetter = (letter) => {
    const word = currentQuestion.haslo;
    const newGuessedWord = [...guessedWord];
    
    // Znajdź pozycję pierwszego pustego miejsca (pomijając spacje)
    let emptyIndex = -1;
    for (let i = 0; i < newGuessedWord.length; i++) {
      if (newGuessedWord[i] === '' && word[i] !== ' ') {
        emptyIndex = i;
        break;
      }
    }
    
    // Jeśli wszystkie miejsca są wypełnione, nie rób nic
    if (emptyIndex === -1) return;
    
    // Sprawdź czy litera pasuje na tę pozycję
    if (word[emptyIndex] === letter) {
      // Poprawna litera
      newGuessedWord[emptyIndex] = letter;
      setLetterUsageCount(prev => ({
        ...prev,
        [letter]: (prev[letter] || 0) + 1
      }));
      
      // Sprawdzamy czy całe słowo zostało odgadnięte (pomijając spacje)
      const isComplete = newGuessedWord.every((char, index) => 
        char !== '' || word[index] === ' '
      );
      
      if (isComplete) {
        setGuessedWord(newGuessedWord);
        setScore(score + 1);
        setShowDialog('correct');
        return;
      }
    } else {
      // Niepoprawna litera
      setLetterUsageCount(prev => ({
        ...prev,
        [letter]: (prev[letter] || 0) + 1
      }));
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      
      if (newMistakes >= 3) {
        setShowDialog('wrong');
        return;
      }
    }
    
    setGuessedWord(newGuessedWord);
  };

  const nextQuestion = () => {
    setShowDialog(null);
    if (currentQuestionIndex < 19) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Koniec gry
      onEnd({
        score: score,
        time: formatTime(elapsedTime)
      });
    }
  };

  const getHint = () => {
    const word = currentQuestion.haslo;
    const newGuessedWord = [...guessedWord];
    
    // Znajdź wszystkie pozycje, które są jeszcze puste (pomijając spacje)
    const emptyPositions = [];
    for (let i = 0; i < newGuessedWord.length; i++) {
      if (newGuessedWord[i] === '' && word[i] !== ' ') {
        emptyPositions.push(i);
      }
    }
    
    // Jeśli nie ma pustych pozycji, nic nie rób
    if (emptyPositions.length === 0) return;
    
    // Wybierz losową pustą pozycję
    const randomIndex = Math.floor(Math.random() * emptyPositions.length);
    const positionToReveal = emptyPositions[randomIndex];
    
    // Odkryj literę
    newGuessedWord[positionToReveal] = word[positionToReveal];
    
    // Zwiększ licznik użytych podpowiedzi
    setHintsUsed(hintsUsed + 1);
    
    // Zaktualizuj stan
    setGuessedWord(newGuessedWord);
    
    // Sprawdź czy całe słowo zostało odgadnięte
    const isComplete = newGuessedWord.every((char, index) => 
      char !== '' || word[index] === ' '
    );
    
    if (isComplete) {
      setScore(score + 1);
      setShowDialog('correct');
    }
  };

  const handleExit = () => {
    onEnd({
      score: score,
      time: formatTime(elapsedTime)
    });
  };

  return (
    <div className="game-screen">
      <div className="game-header">
        {/* USUNIĘTO PRZYCISK COFNIJ */}
        
        <h3>Pytanie {currentQuestionIndex + 1}/20</h3>
        <div className="tagline">Sprawdź, czy jesteś młodzieżowy!</div>
        <div className="header-right">
          <div className="timer">
            <span className="timer-icon">⏱</span>
            {formatTime(elapsedTime)}
          </div>
          <button className="exit-button" onClick={() => setShowExitDialog(true)}>
            <span className="exit-icon">✕</span>
            Zakończ
          </button>
        </div>
      </div>

      <div className="game-content">
        <div className="stats-row">
          <div className={`stat-box ${mistakes >= 3 ? 'stat-danger' : 'stat-warning'}`}>
            <span className="stat-icon">✕</span>
            Błędy: {mistakes}/3
          </div>
          <div className="stat-box stat-success">
            <span className="stat-icon">★</span>
            Wynik: {score}/20
          </div>
        </div>

        <div className="hint-box">
          <p className="hint-text">{currentQuestion.podpowiedz}</p>
        </div>

        <div className="word-display">
          <p className="word-label">HASŁO:</p>
          <div className="word-letters">
            {guessedWord.map((letter, index) => (
              <div 
                key={index} 
                className={`letter-box ${letter && letter !== ' ' ? 'filled' : ''} ${letter === ' ' ? 'space' : ''}`}
              >
                {letter === ' ' ? '' : letter}
              </div>
            ))}
          </div>
        </div>

        {/* Przycisk podpowiedzi */}
        <button className="hint-button" onClick={getHint}>
          <span className="hint-icon">💡</span>
          Podpowiedź
        </button>

        <div className="alphabet-grid">
          {alphabet.map(letter => (
            <button
              key={letter}
              className={getLetterButtonClass(letter)}
              onClick={() => selectLetter(letter)}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {showDialog === 'correct' && (
        <div className="dialog-overlay">
          <div className="dialog">
            <div className="dialog-header success">
              <span className="dialog-icon">✓</span>
              <h3>Brawo!</h3>
            </div>
            <p>Poprawnie odgadłeś hasło!</p>
            <button className="dialog-button success" onClick={nextQuestion}>
              DALEJ
            </button>
          </div>
        </div>
      )}

      {showDialog === 'wrong' && (
        <div className="dialog-overlay">
          <div className="dialog">
            <div className="dialog-header danger">
              <span className="dialog-icon">✕</span>
              <h3>Niestety!</h3>
            </div>
            <p>Poprawna odpowiedź to: <strong>{currentQuestion.haslo}</strong></p>
            <button className="dialog-button primary" onClick={nextQuestion}>
              DALEJ
            </button>
          </div>
        </div>
      )}

      {showExitDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <div className="dialog-header warning">
              <span className="dialog-icon">⚠</span>
              <h3>Zakończyć grę?</h3>
            </div>
            <p>Czy na pewno chcesz zakończyć grę?</p>
            <p className="dialog-subtext">Twój aktualny wynik to: {score}/{currentQuestionIndex + 1}</p>
            <div className="dialog-buttons">
              <button 
                className="dialog-button cancel" 
                onClick={() => setShowExitDialog(false)}
              >
                ANULUJ
              </button>
              <button 
                className="dialog-button danger" 
                onClick={handleExit}
              >
                ZAKOŃCZ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;