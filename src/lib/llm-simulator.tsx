export interface ProbTable {
  [word: string]: {
    total: number;
    following: Record<string, number>;
  };
}

export function generateProbTable(text: string) {
  const ngram: ProbTable = {};
  const words = text
    .split(/[\s.,:;]+/)
    .filter((word) => word.length > 0)
    .map((word) => word.toLowerCase());

  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    // Initialize record for the current word if not present
    if (!ngram[word]) {
      ngram[word] = { total: 0, following: {} };
    }

    ngram[word].total++;

    // If there's a following word, update the following words count
    if (i < words.length - 1) {
      const nextWord = words[i + 1];
      if (!ngram[word].following[nextWord]) {
        ngram[word].following[nextWord] = 0;
      }
      ngram[word].following[nextWord]++;
    }
  }

  return ngram;
}
