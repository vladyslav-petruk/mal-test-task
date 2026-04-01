/** Simulated network latency for mock API calls. */
export function mockDelay(ms: number = DEFAULT_DELAY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const DEFAULT_DELAY_MS = 450;
