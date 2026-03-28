import { For, Show, type Component } from "solid-js";
import type { SavedCalculation } from "../types";
import HistoryItem from "./HistoryItem";

interface HistoryProps {
  items: SavedCalculation[];
  onLoad: (text: string) => void;
  onDelete: (id: string) => void;
  onUpdateTitle: (id: string, title: string) => void;
}

const History: Component<HistoryProps> = (props) => {
  return (
    <div class="flex flex-col gap-3">
      <h2 class="text-sm font-semibold tracking-wide text-neutral-400 uppercase">
        History
      </h2>

      <Show
        when={props.items.length > 0}
        fallback={
          <p class="text-sm text-neutral-600">
            No saved calculations yet.
          </p>
        }
      >
        <div class="flex flex-col gap-2">
          <For each={props.items}>
            {(item) => (
              <HistoryItem
                item={item}
                onLoad={props.onLoad}
                onDelete={props.onDelete}
                onUpdateTitle={props.onUpdateTitle}
              />
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};

export default History;
