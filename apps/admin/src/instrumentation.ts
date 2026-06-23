export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const lsType = typeof (global as Record<string, unknown>)["localStorage"];
    const hasGetItem =
      lsType !== "undefined" &&
      typeof ((global as Record<string, unknown>)["localStorage"] as Record<string, unknown>)?.["getItem"] === "function";

    if (lsType === "undefined" || !hasGetItem) {
      const store = new Map<string, string>();
      Object.defineProperty(global, "localStorage", {
        value: {
          getItem: (key: string) => store.get(key) ?? null,
          setItem: (key: string, value: string) => { store.set(key, value); },
          removeItem: (key: string) => { store.delete(key); },
          clear: () => { store.clear(); },
          key: (index: number) => [...store.keys()][index] ?? null,
          get length() { return store.size; },
        },
        writable: true,
        configurable: true,
      });
    }
  }
}
