import { test as base, expect, type APIRequestContext, type BrowserContext } from "@playwright/test";
import { environment } from "../config/environments";
import { retryTransient } from "../utils/retry";

type Cookie = Awaited<ReturnType<APIRequestContext["storageState"]>>["cookies"][number];
type AuthSession = { token?: string; cookies: Cookie[] };
type WorkerFixtures = { authSession: AuthSession; authToken: string };
type TestFixtures = { authenticatedRequest: APIRequestContext };

export const test = base.extend<TestFixtures, WorkerFixtures>({
  // One API login per worker; every test in that worker reuses this auth session.
  authSession: [async ({ playwright }, use) => {
    const api = await playwright.request.newContext({ baseURL: environment.apiBaseURL });
    try {
      const response = await retryTransient(async () => {
        const result = await api.post(environment.loginPath, {
          data: { email: environment.email, password: environment.password },
          headers: { accept: "application/json", "content-type": "application/json" },
          timeout: 15_000,
        });
        if (result.status() >= 500) throw new Error(`Transient auth-service HTTP ${result.status()}`);
        return result;
      }, environment.authRetries, "API login");
      if (!response.ok()) throw new Error(`API login failed with HTTP ${response.status()}; response body suppressed`);
      const body: unknown = await response.json();
      const tokenValue = readPath(body, environment.tokenJsonPath);
      const token = typeof tokenValue === "string" && tokenValue.length ? tokenValue : undefined;
      const state = await api.storageState();
      if (environment.tokenStorage !== "cookie" && !token) {
        throw new Error(`Login response did not contain a token at configured path '${environment.tokenJsonPath}'`);
      }
      if (environment.tokenStorage === "cookie" && state.cookies.length === 0) {
        throw new Error("Cookie auth selected, but the login API issued no cookies; confirm the auth contract.");
      }
      await use({ token, cookies: state.cookies });
    } finally { await api.dispose(); }
  }, { scope: "worker" }],
  authToken: [async ({ authSession }, use) => {
    if (!authSession.token) throw new Error("This environment is configured for cookie authentication, not bearer tokens.");
    await use(authSession.token);
  }, { scope: "worker" }],
  authenticatedRequest: async ({ playwright, authSession }, use) => {
    const headers = authSession.token ? { Authorization: `Bearer ${authSession.token}` } : {};
    const api = await playwright.request.newContext({
      baseURL: environment.apiBaseURL,
      extraHTTPHeaders: headers,
      storageState: { cookies: authSession.cookies, origins: [] },
    });
    try { await use(api); } finally { await api.dispose(); }
  },
  context: async ({ browser, authSession }, use) => {
    const origin = new URL(environment.baseURL).origin;
    const localStorage = environment.tokenStorage === "localStorage" && authSession.token
      ? [{ name: environment.tokenStorageKey, value: authSession.token }]
      : [];
    const context: BrowserContext = await browser.newContext({
      baseURL: environment.baseURL,
      // Playwright storageState primes cookies and localStorage before each page is created.
      storageState: { cookies: authSession.cookies, origins: localStorage.length ? [{ origin, localStorage }] : [] },
    });
    if (environment.tokenStorage === "cookie") {
      await context.addCookies(authSession.cookies);
    } else if (environment.tokenStorage === "sessionStorage") {
      const token = authSession.token!;
      const key = environment.tokenStorageKey;
      await context.addInitScript(({ key, token }) => window.sessionStorage.setItem(key, token), { key, token });
    }
    await use(context);
    await context.close();
  },
});
export { expect };

function readPath(value: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((current, key) =>
    current && typeof current === "object" ? (current as Record<string, unknown>)[key] : undefined, value);
}
