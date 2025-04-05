"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileUploader } from "../utils/file-uploader";
import { grimm } from "@/lib/texts/grimm";

const PREBUILT_EXAMPLES = [
  {
    id: "story",
    title: "Brüder Grimm Märchen",
    preview: grimm().substring(0, 100) + "...",
    fullText: grimm(),
  },
  {
    id: "news",
    title: "Nachrichtenausschnitt",
    preview:
      "Wissenschaftler haben eine neue Art von Tiefseewesen entdeckt, die anscheinend Biolumineszenz einsetzt, um Beute anzulocken...",
    fullText:
      "Wissenschaftler haben während einer Expedition in den Marianengraben eine neue Art von Tiefseewesen entdeckt, die anscheinend Biolumineszenz einsetzt, um in den dunkelsten Teilen des Ozeans Beute anzulocken. Die Entdeckung wurde mit ferngesteuerten Fahrzeugen gemacht, die mit hochauflösenden Kameras ausgestattet waren.",
  },
  {
    id: "poem",
    title: "Gedicht",
    preview:
      "Herbstflüstern tanzt durch goldene Blätter, wenn das Tageslicht schwindet und der Abend wächst...",
    fullText:
      "Herbstflüstern tanzt durch goldene Blätter, wenn das Tageslicht schwindet und der Abend wächst. Der Erntemond hängt tief und hell, erleuchtet Pfade, wo Schatten fließen. Die Natur bereitet sich auf die lange Umarmung des Winters vor, ein letztes Aufblühen vor dem herannahenden Schnee.",
  },
];

interface TextInputSelectionProps {
  onTextConfirmed: (text: string) => void;
}

export function TextInputSelection({
  onTextConfirmed,
}: TextInputSelectionProps) {
  const [inputType, setInputType] = useState<string>("");
  const [selectedExample, setSelectedExample] = useState<string>("");
  const [customText, setCustomText] = useState<string>("");
  const [uploadedText, setUploadedText] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleExampleSelect = (id: string) => {
    setSelectedExample(id);
  };

  const handleCustomTextChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCustomText(e.target.value);
  };

  const handleFileUploaded = (text: string) => {
    setUploadedText(text);
  };

  const handleConfirm = () => {
    let finalText = "";

    if (inputType === "prebuilt" && selectedExample) {
      finalText =
        PREBUILT_EXAMPLES.find((ex) => ex.id === selectedExample)?.fullText ||
        "";
    } else if (inputType === "custom") {
      finalText = customText;
    } else if (inputType === "upload") {
      finalText = uploadedText;
    }

    if (finalText.trim()) {
      onTextConfirmed(finalText);
    }
  };

  const isConfirmDisabled =
    (inputType === "prebuilt" && !selectedExample) ||
    (inputType === "custom" && !customText.trim()) ||
    (inputType === "upload" && !uploadedText.trim());

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4">
          Wähle eine Trainingsgrundlage für das LLM aus:
        </h3>
        <div className="flex flex-col sm:flex-row gap-2 space-x-4">
          <Button
            variant={inputType === "prebuilt" ? "default" : "outline"}
            onClick={() => setInputType("prebuilt")}
          >
            Vorgefertiger Beispieltext
          </Button>
          <Button
            variant={inputType === "custom" ? "default" : "outline"}
            onClick={() => setInputType("custom")}
          >
            Text manuell eingeben
          </Button>
          <Button
            variant={inputType === "upload" ? "default" : "outline"}
            onClick={() => setInputType("upload")}
          >
            Textdatei hochladen
          </Button>
        </div>
      </div>

      {inputType === "prebuilt" && (
        <div className="space-y-4 pl-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PREBUILT_EXAMPLES.map((example) => (
              <div
                key={example.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedExample === example.id
                    ? "border-gray-900 bg-gray-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleExampleSelect(example.id)}
              >
                <h4 className="font-medium mb-2">{example.title}</h4>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {example.preview}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {inputType === "custom" && (
        <div className="pl-6">
          <Textarea
            placeholder="Paste or type your text here..."
            className="min-h-[150px]"
            value={customText}
            onChange={handleCustomTextChange}
          />
        </div>
      )}

      {inputType === "upload" && (
        <div className="pl-6 space-y-4">
          {!uploadedText || isEditing ? (
            <FileUploader onTextLoaded={handleFileUploaded} />
          ) : (
            <div className="space-y-3">
              <div className="border rounded-lg p-4 max-h-[200px] overflow-y-auto">
                <p className="text-sm whitespace-pre-wrap">{uploadedText}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                Edit Text
              </Button>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end pt-4">
        <Button onClick={handleConfirm} disabled={isConfirmDisabled}>
          Continue
        </Button>
      </div>
    </div>
  );
}
