"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getProbTables, ProbTable, tokenize, ngram } from "@/lib/llm-simulator";
import { Separator } from "../ui/separator";

interface TextGenerationScreenProps {
  knowledgeBase: string;
  initialText: string;
}

export function TextGenerationScreen({
  knowledgeBase,
  initialText,
}: TextGenerationScreenProps) {
  const [generatedText, setGeneratedText] = useState(initialText);
  const [isGenerating, setIsGenerating] = useState(true);
  const [probTables, setProbTables] = useState<{
    unigram: ProbTable;
    bigram: ProbTable;
  }>({
    unigram: {},
    bigram: {},
  });

  const [n, setN] = useState<number>(1);

  useEffect(() => {
    const generatePredictions = async () => {
      setIsGenerating(true);

      // Simuliere eine Verzögerung für die Vorhersagegenerierung
      setTimeout(() => {
        const probsTables = getProbTables(knowledgeBase);
        setProbTables(probsTables);
        setIsGenerating(false);
      }, 500);
    };

    generatePredictions();
  }, [knowledgeBase]);

  const handleUndo = () => {
    const words = tokenize(generatedText);
    if (words.length > 1) {
      setGeneratedText(words.slice(0, -1).join(" "));
    }
  };

  const onReset = () => {
    setGeneratedText(initialText);
  };

  const nextWords = () => {
    const tokens = tokenize(generatedText);

    let lastToken = ngram(tokens, n, tokens.length - n);
    let probTable = n == 1 ? probTables.unigram : probTables.bigram; // Use the appropriate probability table based on n
    console.log(lastToken, probTable[lastToken]);

    const lastTokenExists = Object.keys(probTable).includes(lastToken);

    if (!lastTokenExists) {
      probTable = probTables.unigram; // Fallback to unigram if bigram doesn't exist
      lastToken = ngram(tokens, 1, tokens.length - 1);
    }

    const total = probTable[lastToken].total;
    const ret = Object.entries(probTable[lastToken].following).map(
      ([word, count]) => ({
        word,
        probability: (count / total) * 100,
      })
    );
    return ret.sort((a, b) => b.probability - a.probability).slice(0, 10); // Top 1  predictions
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Generierter Text</h3>
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={handleUndo}>
              Rückgängig
            </Button>
            <Button variant="outline" size="sm" onClick={onReset}>
              Neu starten
            </Button>
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border min-h-[100px]">
          <p className="whitespace-pre-wrap">{generatedText}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          Wähle die Länge des Kontext aus:
        </h3>
        <div className="space-x-2">
          <Button
            variant={n == 1 ? "default" : "outline"}
            size="sm"
            onClick={() => setN(1)}
          >
            1
          </Button>{" "}
          <Button
            variant={n == 2 ? "default" : "outline"}
            size="sm"
            onClick={() => setN(2)}
          >
            2
          </Button>{" "}
          {/* <Button
            variant={n == 3 ? "default" : "outline"}
            size="sm"
            onClick={() => setN(3)}
          >
            3
          </Button> */}
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Wähle das nächste Wort</h3>

        {isGenerating ? (
          <div className="flex justify-center py-4">
            <div className="animate-pulse flex space-x-4">
              <div className="h-10 w-24 bg-gray-200 rounded"></div>
              <div className="h-10 w-24 bg-gray-200 rounded"></div>
              <div className="h-10 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {nextWords().map((value) => {
              return (
                <Button
                  key={value.word}
                  variant="outline"
                  size="lg"
                  className="text-lg px-6 py-2 h-auto"
                  onClick={() => {
                    let out = generatedText;
                    if ([".", ",", "!", "?"].includes(value.word)) {
                      out += value.word;
                    } else {
                      out += " " + value.word;
                    }
                    setGeneratedText(out);
                  }}
                >
                  <div>{Math.floor(value.probability * 10) / 10} %</div>
                  <Separator orientation="vertical"></Separator>
                  <div>{value.word}</div>
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
