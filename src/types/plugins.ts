type Plugin = {
  name: string;
  setup: () => Record<string, unknown>;
};

export type { Plugin };
