export type TestEnvironment = "dev" | "qa" | "uat";

const selected = process.env.TEST_ENV?.trim().toLowerCase();
if (!selected || !["dev", "qa", "uat"].includes(selected)) {
  throw new Error("Set TEST_ENV explicitly to dev, qa or uat. No production target is supported.");
}
const name = selected as TestEnvironment;
const upper = name.toUpperCase();
function required(key: string): string {
  const value = process.env[key]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}
function validateHttps(value: string, key: string): string {
  const parsed = new URL(value);
  if (parsed.protocol !== "https:" && process.env.ALLOW_INSECURE_LOCAL !== "true") {
    throw new Error(`${key} must use HTTPS (set ALLOW_INSECURE_LOCAL=true only for local test doubles)`);
  }
  return parsed.toString().replace(/\/$/, "");
}
const baseURL = validateHttps(required(`${upper}_BASE_URL`), `${upper}_BASE_URL`);
const apiBaseURL = validateHttps(process.env[`${upper}_API_BASE_URL`]?.trim() || baseURL, `${upper}_API_BASE_URL`);
export const environment = {
  name,
  baseURL,
  apiBaseURL,
  loginPath: process.env.AUTH_LOGIN_PATH?.trim() || "/auth/login",
  tokenJsonPath: process.env.AUTH_TOKEN_JSON_PATH?.trim() || "token",
  tokenStorage: (process.env.AUTH_TOKEN_STORAGE?.trim() || "localStorage") as "localStorage" | "sessionStorage" | "cookie",
  tokenStorageKey: process.env.AUTH_TOKEN_STORAGE_KEY?.trim() || "accessToken",
  email: required(`${upper}_TEST_USER_EMAIL`),
  password: required(`${upper}_TEST_USER_PASSWORD`),
  authRetries: Number(process.env.AUTH_RETRIES ?? "2"),
};
if (!["localStorage", "sessionStorage", "cookie"].includes(environment.tokenStorage)) {
  throw new Error("AUTH_TOKEN_STORAGE must be localStorage, sessionStorage or cookie");
}
if (!Number.isInteger(environment.authRetries) || environment.authRetries < 0 || environment.authRetries > 4) {
  throw new Error("AUTH_RETRIES must be an integer from 0 to 4");
}
