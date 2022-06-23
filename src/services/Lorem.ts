import { nanoid } from '@reduxjs/toolkit';
import { LoremIpsum } from 'lorem-ipsum';

export function getTitle() {
  const loremForNames = new LoremIpsum({
    wordsPerSentence: {
      max: 2,
      min: 1
    },
    seed: nanoid()
  });

  const result = loremForNames.generateSentences(1);
  return result.substring(0, result.length - 2);
}

export function getSentence() {
  const loremForSentences = new LoremIpsum({
     wordsPerSentence: {
      max: 10,
      min: 3
    },
    seed: nanoid()
  });

  return loremForSentences.generateParagraphs(1);
}
