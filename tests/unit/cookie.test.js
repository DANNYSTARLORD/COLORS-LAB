function saveCookie(firstName, lastName, userId) {
  const minutes = 20;
  const date = new Date();
  date.setTime(date.getTime() + minutes * 60 * 1000);
  return `firstName=${firstName},lastName=${lastName},userId=${userId};expires=${date.toGMTString()}`;
}

function readCookie(cookieString) {
  let userId = -1;
  let firstName = "";
  let lastName = "";

  const splits = cookieString.split(",");
  for (let i = 0; i < splits.length; i++) {
    const thisOne = splits[i].trim();
    const tokens = thisOne.split("=");
    if (tokens[0] === "firstName") {
      firstName = tokens[1];
    } else if (tokens[0] === "lastName") {
      lastName = tokens[1];
    } else if (tokens[0] === "userId") {
      userId = parseInt(tokens[1].trim());
    }
  }

  return { firstName, lastName, userId };
}

// --- tests ---

describe("saveCookie", () => {
  test("returns a string containing firstName", () => {
    const result = saveCookie("John", "Doe", 42);
    expect(result).toContain("firstName=John");
  });

  test("returns a string containing lastName", () => {
    const result = saveCookie("John", "Doe", 42);
    expect(result).toContain("lastName=Doe");
  });

  test("returns a string containing userId", () => {
    const result = saveCookie("John", "Doe", 42);
    expect(result).toContain("userId=42");
  });

  test("includes an expiry date", () => {
    const result = saveCookie("Jane", "Smith", 7);
    expect(result).toContain("expires=");
  });
});

describe("readCookie", () => {
  test("parses firstName correctly", () => {
    const { firstName } = readCookie("firstName=John,lastName=Doe,userId=42");
    expect(firstName).toBe("John");
  });

  test("parses lastName correctly", () => {
    const { lastName } = readCookie("firstName=John,lastName=Doe,userId=42");
    expect(lastName).toBe("Doe");
  });

  test("parses userId as integer", () => {
    const { userId } = readCookie("firstName=John,lastName=Doe,userId=42");
    expect(userId).toBe(42);
  });

  test("returns userId -1 when cookie is empty", () => {
    const { userId } = readCookie("");
    expect(userId).toBe(-1);
  });

  test("returns userId -1 when userId field is missing", () => {
    const { userId } = readCookie("firstName=John,lastName=Doe");
    expect(userId).toBe(-1);
  });
});