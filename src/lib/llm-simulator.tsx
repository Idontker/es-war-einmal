export interface ProbTable {
  [word: string]: {
    total: number;
    following: Record<string, number>;
  };
}
export function tokenize(text: string) {
  return text
    .replaceAll(".", " . ")
    .replaceAll(":", " : ")
    .replaceAll(",", " , ")
    .replaceAll("!", " ! ")
    .replaceAll("?", " ? ")
    .replaceAll('"', ' " ')
    .split(/[\s]+/)
    .filter((word) => word.length > 0);
}

export const ngram = (words: string[], n: number, i: number) => {
  return words.slice(i, i + n).join(" ");
};

function generateProbTable(text: string, n: number = 1) {
  const table: ProbTable = {};
  const words = tokenize(text);
  // .map((word) => word.toLowerCase()); // removed for case sensitive mapping

  console.log(words);

  for (let i = 0; i < words.length - n; i++) {
    const word = ngram(words, n, i); // Get the n-gram for the current position

    if (i < 2) {
      console.log(word);
    }

    // Initialize record for the current word if not present
    if (!table[word]) {
      table[word] = { total: 0, following: {} };
    }

    table[word].total++;

    // If there's a following word, update the following words count
    if (i + n < words.length - 1) {
      const nextWord = words[i + n];
      if (!table[word].following[nextWord]) {
        table[word].following[nextWord] = 0;
      }
      table[word].following[nextWord]++;
    }
  }
  console.log(table);

  return table;
}

export const getProbTables = (text: string) => {
  return {
    unigram: generateProbTable(text, 1),
    bigram: generateProbTable(text, 2),
    // trigram: generateProbTable(text, 3),
    // fourgram: generateProbTable(text, 4),
    // fivegram: generateProbTable(text, 5),
    // sixgram: generateProbTable(text, 6),
    // sevengram: generateProbTable(text, 7),
    // eightgram: generateProbTable(text, 8),
    // ninegram: generateProbTable(text, 9),
    // tengram: generateProbTable(text, 10),
  };
};
