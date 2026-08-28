import { describe, expect, it } from "vitest";
import { getErrorMessage } from "./apiError";

describe("getErrorMessage", () => {
  it("prefers the backend response message", () => {
    const error = { response: { data: { message: "Invalid email" } } };
    expect(getErrorMessage(error, "Failed")).toBe("Invalid email");
  });

  it("uses a meaningful runtime error message", () => {
    expect(getErrorMessage(new Error("Network Error"), "Failed")).toBe(
      "Network Error",
    );
  });

  it("falls back when no useful message exists", () => {
    expect(getErrorMessage({}, "Failed")).toBe("Failed");
    expect(
      getErrorMessage(new Error("Request failed with status code 500"), "Failed"),
    ).toBe("Failed");
  });
});
