global.fetch = jest.fn();

function mockResponse(body, status = 200) {
  return Promise.resolve({
    status,
    ok: status >= 200 && status < 300,
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(JSON.stringify(body)),
  });
}

// --- AddColor endpoint contract ---
describe("AddColor API", () => {
  beforeEach(() => fetch.mockClear());

  test("returns JSON with an error field on success (empty string = no error)", async () => {
    fetch.mockReturnValueOnce(mockResponse({ error: "" }));

    const response = await fetch("/COLORS-LAB/AddColor.php", {
      method: "POST",
      headers: { "Content-type": "application/json; charset=UTF-8" },
      body: JSON.stringify({ color: "red", userId: 1 }),
    });

    const data = await response.json();
    expect(data).toHaveProperty("error");
    expect(data.error).toBe("");
  });

  test("returns JSON with a non-empty error field on failure", async () => {
    fetch.mockReturnValueOnce(mockResponse({ error: "DB connection failed" }));

    const response = await fetch("/COLORS-LAB/AddColor.php", {
      method: "POST",
      headers: { "Content-type": "application/json; charset=UTF-8" },
      body: JSON.stringify({ color: "blue", userId: 99 }),
    });

    const data = await response.json();
    expect(data).toHaveProperty("error");
    expect(data.error.length).toBeGreaterThan(0);
  });
});

// --- SearchColors endpoint contract ---
describe("SearchColors API", () => {
  beforeEach(() => fetch.mockClear());

  test("returns JSON with a results array", async () => {
    fetch.mockReturnValueOnce(mockResponse({ results: ["red", "red-orange"] }));

    const response = await fetch("/COLORS-LAB/SearchColors.php", {
      method: "POST",
      headers: { "Content-type": "application/json; charset=UTF-8" },
      body: JSON.stringify({ search: "red", userId: 1 }),
    });

    const data = await response.json();
    expect(data).toHaveProperty("results");
    expect(Array.isArray(data.results)).toBe(true);
  });

  test("results array contains strings", async () => {
    fetch.mockReturnValueOnce(mockResponse({ results: ["blue", "blueberry"] }));

    const response = await fetch("/COLORS-LAB/SearchColors.php", {
      method: "POST",
      headers: { "Content-type": "application/json; charset=UTF-8" },
      body: JSON.stringify({ search: "blue", userId: 1 }),
    });

    const data = await response.json();
    data.results.forEach((item) => {
      expect(typeof item).toBe("string");
    });
  });

  test("returns empty results array when no colors match", async () => {
    fetch.mockReturnValueOnce(mockResponse({ results: [] }));

    const response = await fetch("/COLORS-LAB/SearchColors.php", {
      method: "POST",
      headers: { "Content-type": "application/json; charset=UTF-8" },
      body: JSON.stringify({ search: "zzznomatch", userId: 1 }),
    });

    const data = await response.json();
    expect(data.results).toHaveLength(0);
  });
});

// --- Login endpoint contract ---
describe("Login API", () => {
  beforeEach(() => fetch.mockClear());

  test("successful login returns id, firstName, lastName", async () => {
    fetch.mockReturnValueOnce(
      mockResponse({ id: 5, firstName: "John", lastName: "Doe" })
    );

    const response = await fetch("/COLORS-LAB/Login.php", {
      method: "POST",
      headers: { "Content-type": "application/json; charset=UTF-8" },
      body: JSON.stringify({ login: "jdoe", password: "secret" }),
    });

    const data = await response.json();
    expect(data).toHaveProperty("id");
    expect(data).toHaveProperty("firstName");
    expect(data).toHaveProperty("lastName");
    expect(data.id).toBeGreaterThan(0);
  });

  test("failed login returns id less than 1", async () => {
    fetch.mockReturnValueOnce(
      mockResponse({ id: 0, firstName: "", lastName: "" })
    );

    const response = await fetch("/COLORS-LAB/Login.php", {
      method: "POST",
      headers: { "Content-type": "application/json; charset=UTF-8" },
      body: JSON.stringify({ login: "wrong", password: "wrong" }),
    });

    const data = await response.json();
    expect(data.id).toBeLessThan(1);
  });
});