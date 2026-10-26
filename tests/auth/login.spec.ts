import { test, expect } from "../../fixtures/auth.fixture";

test("configured synthetic test account authenticates successfully", async ({ authenticatedRequest }) => {
  const response = await authenticatedRequest.get("/customers");
  expect(response.status()).toBe(200);
});
