import {
  createEffect,
  createSignal,
  type Component,
} from "solid-js";
import Calculator from "./components/Calculator";
import History from "./components/History";
import { computeResult } from "./lib/parser";
import { loadHistory, saveHistory } from "./lib/storage";
import type { SavedCalculation } from "./types";

const App: Component = () => {
  const [text, setText] = createSignal("");
  const [history, setHistory] = createSignal(loadHistory());

  createEffect(() => saveHistory(history()));

  const handleSave = () => {
    const result = computeResult(text());
    if (result.validValues.length === 0) return;

    const entry: SavedCalculation = {
      id: crypto.randomUUID(),
      title: result.autoTitle || "Untitled",
      text: text(),
      equation: result.equation,
      total: result.total,
      savedAt: Date.now(),
    };

    setHistory((prev) => [entry, ...prev]);
  };

  const handleDelete = (id: string) => {
    setHistory((prev) => prev.filter((c) => c.id !== id));
  };

  const handleLoad = (savedText: string) => {
    setText(savedText);
  };

  const handleUpdateTitle = (id: string, title: string) => {
    setHistory((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title } : c)),
    );
  };

  return (
    <div class="min-h-screen bg-neutral-950 text-neutral-100">
      <div class="mx-auto max-w-6xl px-6 py-12">
        {/* Header */}
        <header class="mb-10">
          <h1 class="text-4xl font-bold tracking-tight">
            <span class="text-yellow-400">Text</span>Calc
          </h1>
          <p class="mt-2 text-base text-neutral-500">
            Type numbers with labels, get instant totals.
          </p>
        </header>

        {/* Main layout */}
        <div class="grid gap-10 md:grid-cols-[1fr_360px]">
          <Calculator
            text={text()}
            onTextChange={setText}
            onSave={handleSave}
          />

          <History
            items={history()}
            onLoad={handleLoad}
            onDelete={handleDelete}
            onUpdateTitle={handleUpdateTitle}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
