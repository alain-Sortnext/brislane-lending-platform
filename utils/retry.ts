export async function retryTransient<T>(operation: () => Promise<T>, retries: number, label: string): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try { return await operation(); }
    catch (error) {
      lastError = error;
      if (attempt === retries || !/ECONNRESET|ETIMEDOUT|EAI_AGAIN|network|5\d\d/i.test(String(error))) throw error;
      await new Promise(resolve => setTimeout(resolve, 250 * 2 ** attempt));
    }
  }
  throw new Error(`${label} failed after ${retries + 1} attempts: ${String(lastError)}`);
}
