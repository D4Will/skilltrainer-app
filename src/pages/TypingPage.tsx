import { generate } from "random-words";
import { useState, useRef, useEffect, useEffectEvent, createRef } from "react";
import type { ReactNode, RefObject } from "react";
import type { KeyboardEvent } from "react";
import Timer from "../components/Timer";
import Button from "../components/Button";
import { submitTypingScore } from "../endpoints/api";
import { useAuth } from "../contexts/useAuth";

const TypingPage = () => {
  const auth = useAuth();

  type status = "not started" | "restarted" | "in progress" | "ended";
  type letterStatus = "correct" | "incorrect" | "too_many";
  type loadStatus = "not saved" | "saving" | "saved";

  const [gameStatus, setGameStatus] = useState<status>("not started");
  const [loadStatus, setLoadStatus] = useState<loadStatus>("not saved");

  const [restart, setRestart] = useState<boolean>(false);

  const [wordNodes, setWordNodes] = useState<ReactNode[]>([]);
  const [selectedTime, setSelectedTime] = useState<number>(15);
  const [capsLock, setCapsLock] = useState<boolean>(false);

  const [WPM, setWPM] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(0);
  const [rawWPM, setRawWPM] = useState<number>(0);

  const wordList = useRef<string[]>(["init"]);
  const word = useRef<string>("");
  const wordIndex = useRef<number>(0);
  const wordListRefs = useRef<RefObject<HTMLDivElement | null>[]>([]);
  const wordAmount = useRef<number>(1000);

  const correctWordsIndexes = useRef<number[]>([]);
  const correctChars = useRef<number>(0);
  const incorrectChars = useRef<number>(0);
  const missingChars = useRef<number>(0);
  const correctSpaces = useRef<number>(0);
  const incorrectSpaces = useRef<number>(0);

  const typedWord = useRef<string>("");
  const typedWordList = useRef<string[]>([]);

  const restartRef = useRef<HTMLButtonElement>(null);

  // Checks for CapsLock being used
  const onKeyUp = useEffectEvent((e: globalThis.KeyboardEvent) => {
    e.stopPropagation();

    if (e.getModifierState("CapsLock")) {
      setCapsLock(true);
    } else {
      setCapsLock(false);
    }
  });

  // Sets up and removes onKeyUp effectEvent
  useEffect(() => {
    window.addEventListener("keyup", onKeyUp);
    return () => window.removeEventListener("keyup", onKeyUp);
  }, []);

  // Generates wordList and maps them to HTML elements as wordNodes with refs stores
  // in wordListRefs
  // Resets all refs needed to track the next game
  useEffect(() => {
    if (gameStatus === "not started") {
      wordList.current = ["init"];
      word.current = "";
      wordIndex.current = 0;
      wordListRefs.current = [];
      correctWordsIndexes.current = [];
      correctChars.current = 0;
      incorrectChars.current = 0;
      missingChars.current = 0;
      correctSpaces.current = 0;
      incorrectSpaces.current = 0;
      typedWord.current = "";
      typedWordList.current = [];

      function generateWords(wordAmount: number): string[] {
        const words: string[] = generate({
          exactly: wordAmount,
          minLength: 2,
          maxLength: 7,
        }) as string[];
        return words;
      }

      wordListRefs.current = wordListRefs.current.slice(0, wordAmount.current);

      wordList.current = generateWords(wordAmount.current);
      word.current = wordList.current[wordIndex.current];

      const nodes = wordList.current.map((word, index) => {
        wordListRefs.current[index] = createRef<HTMLDivElement>();

        return (
          <div key={index} className="typing-word-item">
            <div className="typing-word-item-placeholder">{word}</div>
            <div
              className="typing-word-item-text"
              ref={wordListRefs.current[index]}
              contentEditable="true"
              spellCheck="false"
            />
          </div>
        );
      });

      setWordNodes(nodes);
    }
  }, [gameStatus, restart]);

  // Set focus to first word after words are loaded in
  useEffect(() => {
    if (wordNodes.length > 0) {
      setCursor();
    }
  }, [wordNodes]);

  // if gameStatus is ended, caluculate scores and update states before presenting to user
  useEffect(() => {
    if (gameStatus === "ended") {
      setLoadStatus("not saved");

      const totalChars =
        correctChars.current +
        incorrectChars.current +
        correctSpaces.current +
        incorrectSpaces.current;

      let count: number = 0;

      correctWordsIndexes.current.forEach((index) => {
        count += wordList.current[index].length;
      });
      if (
        typedWord.current ===
        word.current.substring(0, typedWord.current.length)
      ) {
        count += typedWord.current.length;
      }
      count += correctSpaces.current;

      const wpm: number = Math.round((count / 5) * (60 / selectedTime));

      const acc: number =
        Math.round(
          ((correctChars.current + correctSpaces.current) / totalChars) *
            100 *
            10,
        ) / 10;

      const raw: number = Math.round((totalChars / 5) * (60 / selectedTime));

      setWPM(wpm);
      setAccuracy(acc);
      setRawWPM(raw);
    }
  }, [gameStatus]);

  function handleKeyPress(e: KeyboardEvent): void {
    e.stopPropagation();

    if (e.key === "Backspace") {
      if (typedWord.current.length === 0) {
        if (wordIndex.current > 0) {
          if (!correctWordsIndexes.current.includes(wordIndex.current - 1)) {
            e.preventDefault();
            // Decrement wordIndex then set typedWord to previously typedWord and word to previous word
            wordIndex.current -= 1;
            word.current = wordList.current[wordIndex.current];
            typedWord.current = typedWordList.current.pop() as string;
            // If last typedWord was missing characters, remove missing characters from incorrectChars
            if (typedWord.current.length < word.current.length) {
              missingChars.current -=
                word.current.length - typedWord.current.length;
              incorrectSpaces.current -= 1;
            } else if (typedWord.current === word.current) {
              correctSpaces.current -= 1;
            } else {
              incorrectSpaces.current -= 1;
            }
            // Focus last word
            setCursor();
          }
        }
      } else {
        // Slice last char off typedWord, update correctChars and incorrectChars
        if (
          typedWord.current.charAt(typedWord.current.length - 1) ===
          word.current.charAt(typedWord.current.length - 1)
        ) {
          correctChars.current -= 1;
        } else {
          incorrectChars.current -= 1;
        }
        typedWord.current = typedWord.current.substring(
          0,
          typedWord.current.length - 1,
        );
        // Get rid of <br> tag that is created when all contents are erased
        if (typedWord.current.length === 0) {
          clearWord();
          setCursor();
        }
      }
    } else if (e.key === " ") {
      if (wordIndex.current === wordAmount.current - 1) {
        e.preventDefault();
        return;
      }
      // Check if typedWord is same length as word, if not, remaining chars will count as incorrect
      e.preventDefault();
      if (typedWord.current.length < word.current.length) {
        missingChars.current += word.current.length - typedWord.current.length;
        incorrectSpaces.current += 1;
        // If typedWord is equal to word, then add wordIndex to correctWordsIndexes
      } else if (typedWord.current === word.current) {
        correctWordsIndexes.current.push(wordIndex.current);
        correctSpaces.current += 1;
      } else {
        incorrectSpaces.current += 1;
      }
      // Increment wordIndex
      wordIndex.current += 1;
      // Add typedWord to end of typedWordList then empty it
      typedWordList.current.push(typedWord.current);
      typedWord.current = "";
      // Set word to next word in wordList
      word.current = wordList.current[wordIndex.current];
      // Focus next word
      wordListRefs.current[wordIndex.current]?.current?.focus();
    } else if (e.key.length === 1) {
      // Start game if not started
      if (gameStatus === "not started") {
        setGameStatus(() => "in progress");
      }
      if (typedWord.current.length < word.current.length) {
        if (e.key === word.current.charAt(typedWord.current.length)) {
          typedWord.current += e.key;
          correctChars.current += 1;
          e.preventDefault();
          addLetter(e.key, "correct");
          setCursor();
        } else {
          typedWord.current += e.key;
          incorrectChars.current += 1;
          e.preventDefault();
          addLetter(
            word.current.charAt(typedWord.current.length - 1),
            "incorrect",
          );
          setCursor();
        }
      } else {
        typedWord.current += e.key;
        incorrectChars.current += 1;
        e.preventDefault();
        addLetter(e.key, "too_many");
        setCursor();
      }
    } else if (e.shiftKey) {
      // Do nothing for shift
    } else if (e.key === "Tab") {
      e.preventDefault();
      restartRef.current?.focus();
    } else {
      // Key is not space, Backspace, Shift, a number or letter
      // Do nothing
      e.preventDefault();
    }
  }

  function setCursor(): void {
    const range = document.createRange();
    const selection = window.getSelection();
    const element = wordListRefs.current[wordIndex.current]!.current!;

    if (element.childNodes[0]) {
      range.setStart(element.childNodes[typedWord.current.length - 1], 1);
    }
    range.collapse(true);
    selection?.removeAllRanges();
    selection?.addRange(range);
    element.focus();
    element.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function addLetter(letter: string, letterStatus: letterStatus): void {
    const element = wordListRefs.current[wordIndex.current]!.current!;
    const span = document.createElement("span");
    const className = "typing-char-" + letterStatus;
    span.classList.add(className);

    const addLetter = document.createTextNode(letter);
    span.appendChild(addLetter);

    element.appendChild(span);
  }

  function clearWord(): void {
    const element = wordListRefs.current[wordIndex.current]!.current!;
    if (element.firstChild) element.removeChild(element.firstChild);
  }

  async function saveScore(): Promise<void> {
    setLoadStatus("saving");
    await submitTypingScore(WPM, accuracy, rawWPM, selectedTime);
    setLoadStatus("saved");
  }

  return (
    <>
      {(gameStatus === "not started" || gameStatus === "in progress") && (
        <div className="typing-page-layout">
          {gameStatus === "not started" && (
            <div className="typing-button-group">
              <Button
                className="typing-time-selector"
                activeClassName="typing-time-selector-active"
                onClick={() => setSelectedTime(15)}
                isActive={selectedTime === 15}
              >
                15 Seconds
              </Button>
              <Button
                className="typing-time-selector"
                activeClassName="typing-time-selector-active"
                onClick={() => setSelectedTime(30)}
                isActive={selectedTime === 30}
              >
                30 Seconds
              </Button>
              <Button
                className="typing-time-selector"
                activeClassName="typing-time-selector-active"
                onClick={() => setSelectedTime(60)}
                isActive={selectedTime === 60}
              >
                60 Seconds
              </Button>
            </div>
          )}
          <Timer
            className="typing-timer"
            gameStatus={gameStatus}
            updateGameStatus={(status: status) => {
              setGameStatus(status);
            }}
            selectedTime={selectedTime}
          />
          {capsLock && <div className="typing-CapsLock">Caps Lock</div>}
          <div
            className="typing-word-list-container"
            onClick={setCursor}
            onKeyDown={handleKeyPress}
          >
            {wordNodes}
          </div>
          <button
            className="typing-restart"
            onClick={() => {
              setWordNodes([]);
              setGameStatus("not started");
              setRestart((restart) => !restart);
            }}
            ref={restartRef}
          >
            Restart
          </button>
        </div>
      )}
      {gameStatus === "ended" && (
        <div className="typing-results-main_grid">
          <div className="typing-results-background" />
          <div className="typing-results-title">Results</div>

          <div className="typing-button-wrapper">
            <button
              className="typing-results-play_again"
              onClick={() => {
                setGameStatus("not started");
              }}
            >
              Play Again
            </button>
            {auth.authenticated && (
              <>
                {loadStatus === "not saved" && (
                  <button
                    className="typing-results-save_score"
                    onClick={saveScore}
                  >
                    Save Score
                  </button>
                )}
                {loadStatus === "saving" && (
                  <button className="typing-results-save_score saving" disabled>
                    Saving...
                  </button>
                )}
                {loadStatus === "saved" && (
                  <button className="typing-results-save_score" disabled>
                    Saved!
                  </button>
                )}
              </>
            )}
            {!auth.authenticated && (
              <button
                className="typing-results-save_score"
                title="login to save data"
                disabled
              >
                Save Score
              </button>
            )}
          </div>

          <div className="typing-results-wpm">WPM: {WPM}</div>
          <div className="typing-results-accuracy">Accuracy: {accuracy}%</div>
          <div className="typing-results-raw_wpm">Raw WPM: {rawWPM}</div>
          <div className="typing-results-time_mode">
            Time Mode: {selectedTime} seconds
          </div>
        </div>
      )}
    </>
  );
};

export default TypingPage;
