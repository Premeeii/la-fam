'use client';

import { useEffect, useState } from 'react';
import { alef } from '@/app/fonts';

const words = [
  'if your friend forgot your appointment . . . i’ll help you.',
  'if you have messy bills . . . i’ll record your bills.',
];

export default function TypingText() {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIndex];
    const finishedTyping = text === word;
    const finishedDeleting = text === '';

    const delay = finishedTyping
      ? 1600 //freeze when finished
      : deleting
        ? 25 //deleting speed
        : 45; //typing speed

    const timer = setTimeout(() => {
      if (!deleting && finishedTyping) {
        setDeleting(true);
      } else if (deleting && finishedDeleting) {
        setDeleting(false);
        setWordIndex((index) => (index + 1) % words.length);
      } else {
        setText(
          deleting
            ? word.slice(0, text.length - 1)
            : word.slice(0, text.length + 1),
        );
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [text, deleting, wordIndex]);

  return (
    <span
      className={`${alef.className} inline-block`}
      aria-label={words[wordIndex]}
    >
      <span aria-hidden="true">{text}</span>
      <span className="ml-1 inline-block animate-pulse" aria-hidden="true">
        |
      </span>
    </span>
  );
}
