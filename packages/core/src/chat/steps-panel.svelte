<script lang="ts">
  interface Step {
    content: string;
    status: "pending" | "in_progress" | "completed";
    activeForm?: string;
  }

  interface Props {
    steps: Step[];
  }

  let { steps }: Props = $props();

  let isCollapsed = $state(false);

  const allComplete = $derived(steps.every((s) => s.status === "completed"));

  $effect(() => {
    if (allComplete && steps.length > 0) {
      isCollapsed = true;
    }
  });
</script>

<div class="mt-2 mb-1 border border-(--chat-border) bg-(--chat-bg) rounded-sm overflow-hidden">
  <button
    type="button"
    onclick={() => (isCollapsed = !isCollapsed)}
    class="w-full flex items-center gap-1.5 px-2 py-1 text-[10px] uppercase tracking-wider text-(--chat-text-secondary) hover:bg-(--chat-bg-secondary) transition-colors"
  >
    <svg class="shrink-0" width="10" height="10" viewBox="0 0 24 24" fill="none">
      <path
        d={isCollapsed ? "m9 6 6 6-6 6" : "m6 9 6 6 6-6"}
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <span class="font-medium">steps</span>
    <span class="ml-auto text-(--chat-text-muted)">
      {steps.filter((s) => s.status === "completed").length}/{steps.length}
    </span>
  </button>

  {#if !isCollapsed}
    <div class="border-t border-(--chat-border) divide-y divide-(--chat-border)">
      {#each steps as step, i (i)}
        <div class="flex items-start gap-2 px-2 py-1.5">
          <span class="shrink-0 mt-0.5 w-4 h-4 flex items-center justify-center text-[10px]">
            {#if step.status === "completed"}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="5.5" stroke="currentColor" class="text-green-500" />
                <path d="M3.5 6L5 7.5L8.5 4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" class="text-green-500" />
              </svg>
            {:else if step.status === "in_progress"}
              <svg width="12" height="12" viewBox="0 0 12 12" class="animate-spin text-(--chat-accent)">
                <circle cx="6" cy="6" r="5" stroke="currentColor" stroke-width="1.5" stroke-dasharray="20 12" fill="none" />
              </svg>
            {:else}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="5.5" stroke="currentColor" class="text-(--chat-text-muted)" />
              </svg>
            {/if}
          </span>
          <div class="flex-1 min-w-0">
            <div
              class={`text-xs ${
                step.status === "completed"
                  ? "text-(--chat-text-secondary)"
                  : step.status === "in_progress"
                    ? "text-(--chat-text-primary) font-medium"
                    : "text-(--chat-text-muted)"
              }`}
            >
              {step.status === "in_progress" && step.activeForm ? step.activeForm : step.content}
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
