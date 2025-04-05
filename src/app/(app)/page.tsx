import { LLMDemo } from "@/components/llm/llm-demo";

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            LLM Text Erstellung Erklärt
          </h1>
          <p className="text-gray-600">
            Erlebe, wie große Sprachmodelle das nächste Wort in einer Sequenz
            vorhersagen
          </p>
        </header>
        <LLMDemo />
      </div>
    </main>
  );
}
