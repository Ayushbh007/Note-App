import { writable } from "svelte/store";

export type SyncStatus = "online" | "offline" | "syncing";

function createSyncStatusStore() {
  const { subscribe, set } = writable<SyncStatus>(
    typeof navigator !== "undefined" && navigator.onLine ? "online" : "offline",
  );

  return {
    subscribe,
    set,
    init: () => {
      if (typeof window === "undefined") return;

      const updateStatus = () => {
        set(navigator.onLine ? "online" : "offline");
      };

      window.addEventListener("online", updateStatus);
      window.addEventListener("offline", updateStatus);

      updateStatus();
    },
  };
}

export const syncStatus = createSyncStatusStore();
