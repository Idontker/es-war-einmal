"use client";

import { useEffect, useState } from "react";

interface ProcessingStateProps {
  text: string;
}

export function ProcessingState({ text }: ProcessingStateProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6">
      <div className="w-full max-w-md">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Text wird analysiert
          </span>
          <span className="text-sm font-medium text-gray-700">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-gray-800 h-2.5 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="text-center space-y-2">
        <p className="text-gray-600">Dies kann einen Moment dauern...</p>
        <p className="text-sm text-gray-500 max-w-md">
          Das Modell analysiert deinen Text, zerlegt ihn in kleinere Einheiten
          und bereitet sich darauf vor, Vorhersagen zu generieren.
        </p>
      </div>

      <div className="mt-8 text-center max-w-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Textvorschau:
        </h3>
        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded border">
          {text.length > 150 ? `${text.substring(0, 150)}...` : text}
        </p>
      </div>
    </div>
  );
}
