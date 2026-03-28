import {
  createMemo,
  For,
  onCleanup,
  onMount,
  type Component,
} from "solid-js";
import { computeResult } from "../lib/parser";
import type { RowKind } from "../types";

const rowBg: Record<RowKind, string> = {
  valid: "rgba(16, 185, 129, 0.15)",
  invalid: "rgba(239, 68, 68, 0.15)",
  comment: "rgba(115, 115, 115, 0.1)",
  empty: "rgba(115, 115, 115, 0.05)",
};

interface CalculatorProps {
  text: string;
  onTextChange: (text: string) => void;
  onSave: () => void;
}

const Calculator: Component<CalculatorProps> = (props) => {
  let textareaRef!: HTMLTextAreaElement;
  let highlightRef!: HTMLDivElement;

  const result = createMemo(() => computeResult(props.text));

  const syncScroll = () => {
    highlightRef.scrollTop = textareaRef.scrollTop;
    highlightRef.scrollLeft = textareaRef.scrollLeft;
  };

  onMount(() => {
    const observer = new ResizeObserver(() => {
      highlightRef.style.height = `${textareaRef.offsetHeight}px`;
      highlightRef.style.width = `${textareaRef.offsetWidth}px`;
    });
    observer.observe(textareaRef);
    onCleanup(() => observer.disconnect());
  });

  return (
    <div class="flex flex-col gap-4">
      {/* Textarea with highlight overlay */}
      <div class="relative">
        <div
          ref={highlightRef}
          class="pointer-events-none absolute inset-0 overflow-hidden rounded-xl p-5 font-mono text-base leading-[1.625] break-words whitespace-pre-wrap"
          aria-hidden="true"
        >
          <For each={result().rows}>
            {(row) => (
              <div
                style={{ background: rowBg[row.kind] }}
                class="-mx-1 rounded-sm px-1"
              >
                <span class="invisible">
                  {row.raw || "\u00A0"}
                </span>
              </div>
            )}
          </For>
        </div>
        <textarea
          ref={textareaRef}
          value={props.text}
          onInput={(e) =>
            props.onTextChange(e.currentTarget.value)
          }
          onScroll={syncScroll}
          placeholder={`Enter rows like:\n10.3 nuts\n12 almonds\n15,3 pistachio\n# this is a comment`}
          rows={16}
          class="relative w-full resize-y rounded-xl bg-transparent p-5 font-mono text-base leading-[1.625] text-neutral-100 caret-yellow-400 ring-1 ring-white/10 placeholder:text-neutral-500 focus:ring-yellow-500/50 focus:outline-none"
          style={{
            "white-space": "pre-wrap",
            "word-wrap": "break-word",
          }}
          spellcheck={false}
        />
      </div>

      {/* Result */}
      {result().validValues.length > 0 && (
        <div class="rounded-xl bg-neutral-900 p-5 ring-1 ring-white/5">
          <p class="font-mono text-base text-neutral-400">
            {result().equation}
          </p>
          <p class="mt-2 font-mono text-4xl font-bold text-yellow-400">
            = {result().total}
          </p>
        </div>
      )}

      {/* Save button */}
      <button
        onClick={() => props.onSave()}
        disabled={result().validValues.length === 0}
        class="cursor-pointer self-start rounded-lg bg-yellow-600 px-5 py-2.5 text-base font-medium text-white transition-colors hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Save calculation
      </button>
    </div>
  );
};

export default Calculator;
