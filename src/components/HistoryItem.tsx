import { createSignal, Show, type Component } from "solid-js";
import type { SavedCalculation } from "../types";

interface HistoryItemProps {
  item: SavedCalculation;
  onLoad: (text: string) => void;
  onDelete: (id: string) => void;
  onUpdateTitle: (id: string, title: string) => void;
}

const HistoryItem: Component<HistoryItemProps> = (props) => {
  const [editing, setEditing] = createSignal(false);
  const [editTitle, setEditTitle] = createSignal("");

  const startEdit = () => {
    setEditTitle(props.item.title);
    setEditing(true);
  };

  const commitEdit = () => {
    const trimmed = editTitle().trim();
    if (trimmed) {
      props.onUpdateTitle(props.item.id, trimmed);
    }
    setEditing(false);
  };

  const date = () =>
    new Date(props.item.savedAt).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div class="group rounded-xl bg-neutral-800/50 p-3 ring-1 ring-white/5 transition-colors hover:bg-neutral-800">
      {/* Title */}
      <Show
        when={!editing()}
        fallback={
          <input
            value={editTitle()}
            onInput={(e) => setEditTitle(e.currentTarget.value)}
            onBlur={commitEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitEdit();
              if (e.key === "Escape") setEditing(false);
            }}
            class="mb-1 w-full rounded bg-neutral-700 px-2 py-0.5 text-sm text-neutral-100 focus:ring-1 focus:ring-yellow-500/50 focus:outline-none"
            ref={(el) => setTimeout(() => el.focus())}
          />
        }
      >
        <button
          onClick={startEdit}
          class="mb-1 cursor-pointer text-left text-sm font-medium text-neutral-200 hover:text-yellow-400"
          title="Click to edit title"
        >
          {props.item.title || "Untitled"}
        </button>
      </Show>

      {/* Equation + total */}
      <p class="truncate font-mono text-xs text-neutral-500">
        {props.item.equation}
      </p>
      <p class="font-mono text-sm font-bold text-yellow-400">
        = {props.item.total}
      </p>

      {/* Meta + actions */}
      <div class="mt-2 flex items-center gap-2 text-xs">
        <span class="text-neutral-600">{date()}</span>
        <div class="ml-auto flex gap-1">
          <button
            onClick={() => props.onLoad(props.item.text)}
            class="cursor-pointer rounded bg-neutral-700 px-2 py-0.5 text-neutral-300 transition-colors hover:bg-neutral-600"
          >
            Load
          </button>
          <button
            onClick={() => props.onDelete(props.item.id)}
            class="cursor-pointer rounded bg-neutral-700 px-2 py-0.5 text-red-400 transition-colors hover:bg-red-900/30"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryItem;
