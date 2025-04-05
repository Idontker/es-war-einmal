"use client";

import { useState } from "react";
import { TextInputSelection } from "./text-input-selection";
import { ProcessingState } from "./processing-state";
import { Button } from "../ui/button";
import { TextGenerationScreen } from "./text-generation-screen";

export type DemoStep = "input" | "processing" | "generation";

export function LLMDemo() {
  const [step, setStep] = useState<DemoStep>("input");
  const [inputText, setInputText] = useState<string>("");
  const [generatedText, setGeneratedText] = useState<string>("");

  // const handleTextConfirmed = () => {
  const handleTextConfirmed = (text: string) => {
    setInputText(text);
    setStep("processing");

    // Simulate processing time
    setTimeout(() => {
      setGeneratedText(text.split(" ").slice(0, 4).join(" "));
      setStep("generation");
    }, 2000);
  };

  const handleReset = () => {
    setStep("input");
    setInputText("");
    setGeneratedText("");
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-gray-100 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">LLM Text Erstellung</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              Schritt{" "}
              {step === "input" ? "1" : step === "processing" ? "2" : "3"} von 3
            </span>
            {step !== "input" && (
              <Button onClick={handleReset}>Neustarten</Button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        {step === "input" && (
          <TextInputSelection onTextConfirmed={handleTextConfirmed} />
        )}

        {step === "processing" && <ProcessingState text={inputText} />}

        {step === "generation" && (
          <TextGenerationScreen
            knowledgeBase={inputText}
            initialText={generatedText}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}
