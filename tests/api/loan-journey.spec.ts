import { test, expect } from "../../fixtures/auth.fixture";
import { environment } from "../../config/environments";

test.describe("Brislane loan journey API", () => {
  test.describe.configure({ mode: "serial" });
  let applicationId = "";

  test("API authentication session can access payments", async ({ authenticatedRequest }) => {
    const response = await authenticatedRequest.get("/payments");
    expect(response.status()).toBe(200);
  });

  test("GET /customers returns a customer list", async ({ authenticatedRequest }) => {
    const response = await authenticatedRequest.get("/customers");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    if (body.length > 0) expect(body[0]).toHaveProperty("id");
  });

  test("POST /loans/applications creates a draft application", async ({ authenticatedRequest }) => {
    const response = await authenticatedRequest.post("/loans/applications", {
      data: { customer_id: "C1000001", loan_amount: 5000, loan_term_months: 24, purpose: "home_improvement" },
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.id).toBeTruthy();
    expect(body.status).toBe("draft");
    applicationId = body.id;
  });

  test("PUT /loans/submit submits the created application", async ({ authenticatedRequest }) => {
    expect(applicationId).not.toBe("");
    const response = await authenticatedRequest.put("/loans/submit", {
      data: { application_id: applicationId, declaration_accepted: true },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.status).toBe("submitted");
  });

  test("GET /payments returns a payment schedule", async ({ authenticatedRequest }) => {
    const response = await authenticatedRequest.get("/payments");
    expect(response.status()).toBe(200);
    expect(Array.isArray(await response.json())).toBeTruthy();
  });

  test("SEC-1: expired or malformed token is rejected", async ({ request }) => {
    const response = await request.get(new URL("/customers", environment.apiBaseURL).toString(), {
      headers: { Authorization: "Bearer EXPIRED_TOKEN_FOR_TEST" },
    });
    expect(response.status()).toBe(401);
  });

  test("SEC-2: missing token is rejected", async ({ request }) => {
    const response = await request.get(new URL("/customers", environment.apiBaseURL).toString());
    expect(response.status()).toBe(401);
  });
});
