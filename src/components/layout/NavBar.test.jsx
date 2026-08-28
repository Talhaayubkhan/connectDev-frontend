import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../test/renderApp";
import NavBar from "./NavBar";

const { mockUseProfile, mockUseLogout } = vi.hoisted(() => ({
  mockUseProfile: vi.fn(),
  mockUseLogout: vi.fn(),
}));

vi.mock("../../hooks/profile/useShowProfile", () => ({
  useShowProfile: mockUseProfile,
}));
vi.mock("../../hooks/auth/useAuthMutation", () => ({
  useLogoutMutation: mockUseLogout,
}));

describe("NavBar", () => {
  beforeEach(() => {
    mockUseProfile.mockReturnValue({
      data: {
        firstName: "Ada",
        lastName: "Lovelace",
        email: "ada@example.com",
      },
    });
    mockUseLogout.mockReturnValue({ mutate: vi.fn(), isPending: false });
  });

  it("provides an accessible mobile menu that closes with Escape", async () => {
    const user = userEvent.setup();
    renderWithProviders(<NavBar />, { initialEntries: ["/requests"] });

    const trigger = screen.getByRole("button", { name: /open navigation/i });
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("dialog", { name: /navigation/i }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: "Requests" }).at(-1),
    ).toHaveAttribute("aria-current", "page");

    await user.keyboard("{Escape}");
    expect(
      screen.queryByRole("dialog", { name: /navigation/i }),
    ).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
