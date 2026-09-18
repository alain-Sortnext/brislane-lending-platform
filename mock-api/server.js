const http = require("http");
const PORT = process.env.PORT || 3000;

const VALID_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJDMTAwMDAwMSIsInJvbGUiOiJjdXN0b21lciIsImV4cCI6OTk5OTk5OTk5OX0.brislane_mock_valid";

function json(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
  res.end(JSON.stringify(body));
}

function getToken(req) {
  const auth = req.headers["authorization"] || "";
  return auth.replace("Bearer ", "").trim();
}

function checkAuth(req, res) {
  const token = getToken(req);
  if (!token) { json(res, 401, { error: "Unauthorized", message: "No token provided" }); return false; }
  if (token !== VALID_TOKEN) { json(res, 401, { error: "Unauthorized", message: "Invalid or expired token" }); return false; }
  return true;
}

const requestCounts = {};

const server = http.createServer((req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Authorization, Content-Type" });
    return res.end();
  }

  const url = req.url;
  const method = req.method;

  let body = "";
  req.on("data", c => body += c);
  req.on("end", () => {

    // POST /auth/login
    if (method === "POST" && url === "/auth/login") {
      return json(res, 200, {
        token: VALID_TOKEN,
        token_type: "Bearer",
        expires_in: 3600,
        user: { id: "C1000001", email: "test.candidate@brislane.com", role: "customer" }
      });
    }

    // GET /customers
    if (method === "GET" && url === "/customers") {
      if (!checkAuth(req, res)) return;
      return json(res, 200, [
        { id: "C1000001", email: "john.smith@example.com", first_name: "John", last_name: "Smith", status: "active", created_at: "2026-01-15T10:00:00Z" },
        { id: "C1000002", email: "sarah.jones@example.com", first_name: "Sarah", last_name: "Jones", status: "active", created_at: "2026-02-20T14:30:00Z" }
      ]);
    }

    // Cross-customer access test
    if (method === "GET" && url.startsWith("/customers/C1999999")) {
      if (!checkAuth(req, res)) return;
      return json(res, 403, { error: "Forbidden", message: "You do not have permission to access this customer's data" });
    }

    // POST /loans/applications
    if (method === "POST" && url === "/loans/applications") {
      if (!checkAuth(req, res)) return;
      return json(res, 201, {
        id: "LA-2026-00847",
        customer_id: "C1000001",
        loan_amount: 5000,
        loan_term_months: 24,
        purpose: "home_improvement",
        status: "draft",
        created_at: new Date().toISOString()
      });
    }

    // PUT /loans/submit — with rate limiting
    if (method === "PUT" && url === "/loans/submit") {
      if (!checkAuth(req, res)) return;
      const ip = req.socket.remoteAddress || "unknown";
      requestCounts[ip] = (requestCounts[ip] || 0) + 1;
      setTimeout(() => { if (requestCounts[ip]) requestCounts[ip]--; }, 60000);
      if (requestCounts[ip] > 10) {
        return json(res, 429, { error: "Too Many Requests", message: "Rate limit exceeded. Max 10 requests per minute on /loans/submit", retry_after: 60 });
      }
      return json(res, 200, {
        application_id: "LA-2026-00847",
        status: "submitted",
        submitted_at: new Date().toISOString(),
        reference: "BRL-2026-00847",
        message: "Application submitted successfully. Decision expected within 2 hours."
      });
    }

    // GET /payments
    if (method === "GET" && url === "/payments") {
      if (!checkAuth(req, res)) return;
      return json(res, 200, [
        { id: "PAY-001", loan_id: "LA-2026-00847", amount: 231.50, due_date: "2026-10-01", status: "pending" },
        { id: "PAY-002", loan_id: "LA-2026-00847", amount: 231.50, due_date: "2026-11-01", status: "pending" }
      ]);
    }

    // 404
    json(res, 404, { error: "Not Found", message: `${method} ${url} is not a valid endpoint` });
  });
});

server.listen(PORT, () => console.log(`Brislane Mock API running on port ${PORT}`));
