"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { generateProbTable, ProbTable } from "@/lib/llm-simulator";
import { Separator } from "../ui/separator";

interface TextGenerationScreenProps {
  knowledgeBase: string;
  initialText: string;
  onReset: () => void;
}

export function TextGenerationScreen({
  knowledgeBase,
  initialText,
  onReset,
}: TextGenerationScreenProps) {
  const [generatedText, setGeneratedText] = useState(initialText);
  const [isGenerating, setIsGenerating] = useState(true);
  const [probTable, setProbTable] = useState<ProbTable>({});

  useEffect(() => {
    const generatePredictions = async () => {
      setIsGenerating(true);

      // Simuliere eine Verzögerung für die Vorhersagegenerierung
      setTimeout(() => {
        const probs = generateProbTable(knowledgeBase);
        setProbTable(probs);
        setIsGenerating(false);
      }, 500);
    };

    generatePredictions();
  }, [knowledgeBase]);

  const handleUndo = () => {
    const words = generatedText.split(" ");
    if (words.length > 1) {
      setGeneratedText(words.slice(0, -1).join(" "));
    }
  };

  const nextWords = (lastWord: string) => {
    console.log(probTable);
    console.log(lastWord);
    const n = probTable[lastWord].total;
    const ret = Object.entries(probTable[lastWord].following).map(
      ([word, count]) => ({
        word,
        probability: (count / n) * 100,
      })
    );
    ret.sort((a, b) => b.probability - a.probability);
    console.log(ret);
    return ret;
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
            {nextWords(generatedText.split(" ").slice(-1)[0]).map((value) => {
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
