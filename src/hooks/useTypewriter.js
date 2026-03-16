import { useEffect, useMemo, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

export function useTypewriter(words, options = {}) {
  const {
    typeSpeed = 70,
    deleteSpeed = 40,
    holdDelay = 1400,
    startDelay = 350,
  } = options;
  const reducedMotion = useReducedMotion();
  const entries = useMemo(() => (Array.isArray(words) ? words.filter(Boolean) : []), [words]);
  const [wordIndex, setWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!entries.length || reducedMotion) return undefined;

    const currentWord = entries[wordIndex % entries.length];
    let timeoutId;

    if (!isDeleting && displayText.length < currentWord.length) {
      timeoutId = window.setTimeout(() => {
        setDisplayText(currentWord.slice(0, displayText.length + 1));
      }, displayText.length ? typeSpeed : startDelay);
    } else if (!isDeleting && displayText.length === currentWord.length) {
      timeoutId = window.setTimeout(() => {
        setIsDeleting(true);
      }, holdDelay);
    } else if (isDeleting && displayText.length > 0) {
      timeoutId = window.setTimeout(() => {
        setDisplayText(currentWord.slice(0, displayText.length - 1));
      }, deleteSpeed);
    } else {
      timeoutId = window.setTimeout(() => {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % entries.length);
      }, 200);
    }

    return () => window.clearTimeout(timeoutId);
  }, [
    deleteSpeed,
    displayText,
    entries,
    holdDelay,
    isDeleting,
    reducedMotion,
    startDelay,
    typeSpeed,
    wordIndex,
  ]);

  if (!entries.length) return '';
  if (reducedMotion) return entries[wordIndex % entries.length];
  return displayText;
}
