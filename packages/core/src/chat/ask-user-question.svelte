<script lang="ts">
  import type { PendingQuestion } from "./pending-questions";
  import { resolvePendingQuestion } from "./pending-questions";

  interface Props {
    pending: PendingQuestion;
  }

  let { pending }: Props = $props();

  // per-question selections: array of selected labels (multi) or single label (single)
  let selections = $state<string[][]>([]);

  $effect(() => {
    // reset when pending changes (new question set)
    selections = pending.questions.map(() => []);
  });

  function toggleOption(qIdx: number, label: string, multiSelect: boolean) {
    if (multiSelect) {
      const current = selections[qIdx];
      if (current.includes(label)) {
        selections[qIdx] = current.filter((l) => l !== label);
      } else {
        selections[qIdx] = [...current, label];
      }
    } else {
      selections[qIdx] = [label];
      // For single-select, auto-submit if it's the last (or only) question
      // and all prior questions are answered
      const allAnswered = selections.every((s, i) =>
        i === qIdx ? true : s.length > 0,
      );
      if (allAnswered && !pending.questions[qIdx].multiSelect) {
        submit();
      }
    }
  }

  function submit() {
    resolvePendingQuestion(pending.toolCallId, selections);
  }

  const allAnswered = $derived(selections.every((s) => s.length > 0));
  const hasMultiSelect = $derived(
    pending.questions.some((q) => q.multiSelect),
  );
</script>

<div class="mt-2 mb-1 border border-(--chat-border) bg-(--chat-bg) rounded-sm overflow-hidden">
  <div class="px-2 py-1.5 border-b border-(--chat-border) text-[10px] uppercase tracking-wider text-(--chat-text-secondary) font-medium">
    action required
  </div>

  <div class="divide-y divide-(--chat-border)">
    {#each pending.questions as q, qIdx (qIdx)}
      <div class="px-2 py-2">
        {#if q.header}
          <div class="text-[10px] uppercase tracking-wider text-(--chat-text-muted) mb-1">
            {q.header}
          </div>
        {/if}
        <div class="text-xs text-(--chat-text-primary) mb-2">{q.question}</div>

        <div class="flex flex-col gap-1">
          {#each q.options as opt (opt.label)}
            {@const selected = selections[qIdx].includes(opt.label)}
            <button
              type="button"
              onclick={() => toggleOption(qIdx, opt.label, q.multiSelect)}
              class={`flex items-start gap-2 px-2 py-1.5 rounded-sm text-left text-xs transition-colors border ${
                selected
                  ? "border-(--chat-accent) bg-(--chat-accent)/10 text-(--chat-text-primary)"
                  : "border-(--chat-border) hover:border-(--chat-accent)/50 hover:bg-(--chat-bg-secondary) text-(--chat-text-secondary)"
              }`}
            >
              {#if q.multiSelect}
                <span
                  class={`shrink-0 mt-0.5 w-3 h-3 border rounded-sm flex items-center justify-center ${
                    selected ? "border-(--chat-accent) bg-(--chat-accent)" : "border-(--chat-text-muted)"
                  }`}
                >
                  {#if selected}
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1.5 4L3 5.5L6.5 2" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  {/if}
                </span>
              {:else}
                <span
                  class={`shrink-0 mt-0.5 w-3 h-3 border rounded-full flex items-center justify-center ${
                    selected ? "border-(--chat-accent)" : "border-(--chat-text-muted)"
                  }`}
                >
                  {#if selected}
                    <span class="w-1.5 h-1.5 rounded-full bg-(--chat-accent)"></span>
                  {/if}
                </span>
              {/if}
              <span class="flex-1 min-w-0">
                <span class="font-medium text-(--chat-text-primary)">{opt.label}</span>
                {#if opt.description}
                  <span class="block text-[10px] text-(--chat-text-muted) mt-0.5">{opt.description}</span>
                {/if}
              </span>
            </button>
          {/each}
        </div>
      </div>
    {/each}
  </div>

  {#if hasMultiSelect}
    <div class="px-2 py-1.5 border-t border-(--chat-border)">
      <button
        type="button"
        onclick={submit}
        disabled={!allAnswered}
        class={`w-full px-3 py-1.5 text-xs font-medium transition-colors rounded-sm ${
          allAnswered
            ? "bg-(--chat-accent) text-white hover:opacity-90"
            : "bg-(--chat-bg-secondary) text-(--chat-text-muted) cursor-not-allowed"
        }`}
      >
        Confirm
      </button>
    </div>
  {/if}
</div>
