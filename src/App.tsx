/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable operator-linebreak */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/no-array-index-key */

import React, { useEffect, useRef, useState } from 'react';
import useRefState from './hooks/useRefState';
import words from './words.json';

const generateText = () => {
  const text = [];
  for (let i = 0; i < 25; i += 1) {
    const word = words[Math.floor(Math.random() * words.length)];
    text.push(word);
  }
  return text;
};

function App() {
  const [text, setText] = useState(generateText());
  const [_typed, setTyped, typed] = useRefState<string[][]>([[]]);
  const [_startTime, setStartTime, startTime] = useRefState(0);

  let eventBind = false;

  const moveCursor = (index: number, plusOffsetWidth: boolean) => {
    const cursorElement = document.querySelector<HTMLDivElement>('#cursor')!;
    const letterElement = document.querySelectorAll('.letter')[index];

    cursorElement.style.top = `${letterElement.offsetTop + letterElement.offsetHeight}px`;
    cursorElement.style.left = `${letterElement.offsetLeft + (plusOffsetWidth ? letterElement.offsetWidth : 0)}px`;
  };

  useEffect(() => {
    moveCursor(0, false);

    if (!eventBind) {
      document.addEventListener('keydown', (event) => {
        if (!startTime.current) {
          setStartTime(new Date().getTime());
        }

        if (
          event.key === ' ' &&
          typed.current[typed.current.length - 1].length === text[typed.current.length - 1].length &&
          typed.current.length < text.length
        ) {
          const newTyped = [...typed.current, []];
          setTyped(newTyped);
        } else if (event.key === text[typed.current.length - 1][typed.current[typed.current.length - 1].length]) {
          const newTyped = [
            ...typed.current.slice(0, typed.current.length - 1),
            [...typed.current[typed.current.length - 1], event.key],
          ];

          setTyped(newTyped);
        }

        if (typed.current.map((e) => e.join('')).join(' ').length === text.join(' ').length) {
          const endTime = new Date().getTime();
          console.log(
            typed.current.map((e) => e.join('')).join(' ').length / 5 / ((endTime - startTime.current) / 60000),
          );
        }

        if (typed.current[typed.current.length - 1].length === text[typed.current.length - 1].length) {
          moveCursor(typed.current.flat().length - 1, true);
        } else {
          moveCursor(typed.current.flat().length, false);
        }
      });

      eventBind = true;
    }
  }, []);

  useEffect(() => {}, [typed]);

  return (
    <div className="font-['Jetbrains_Mono'] w-full h-screen flex flex-col items-center justify-center text-xl p-32 bg-zinc-900 text-zinc-100">
      <div className="text-6xl mb-8 text-zinc-800">
        {_typed.length}/{text.length}
      </div>
      <div className="w-full break-all flex gap-[0.8rem] flex-wrap">
        {text.map((word, wordIndex) => (
          <div className="flex">
            {word.split('').map((char, charIndex) => (
              <span
                className={`letter ${
                  wordIndex < _typed.length - 1 ||
                  (wordIndex === _typed.length - 1 && charIndex < _typed[_typed.length - 1].length)
                    ? 'text-emerald-500'
                    : 'text-gray-500'
                }`}
              >
                {char.replace(' ', '\u00a0')}
              </span>
            ))}
          </div>
        ))}
      </div>
      <div id="cursor" className="w-[0.8rem] border-b-[3px] rounded-full border-emerald-500 absolute transition-all" />
    </div>
  );
}

export default App;
