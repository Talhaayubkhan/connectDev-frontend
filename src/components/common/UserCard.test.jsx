import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../../test/renderApp";
import UserCard from "./UserCard";

const connection = {
  _id: "user-1",
  firstName: "Ada",
  lastName: "Lovelace",
  skills: ["JavaScript"],
};

describe("UserCard", () => {
  it("links connection cards only to implemented profile routes", () => {
    renderWithProviders(<UserCard data={connection} />);

    expect(
      screen.getByRole("link", { name: /view ada lovelace's profile/i }),
    ).toHaveAttribute("href", "/profile/user-1");
    expect(screen.queryByText(/message/i)).not.toBeInTheDocument();
  });
});
