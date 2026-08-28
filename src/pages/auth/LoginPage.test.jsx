import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../test/renderApp";
import LoginPage from "./LoginPage";

const { mockLoginMutation, mockSignupMutation } = vi.hoisted(() => ({
  mockLoginMutation: vi.fn(),
  mockSignupMutation: vi.fn(),
}));

vi.mock("../../hooks/auth/useAuthMutation", () => ({
  useLoginMutation: () => mockLoginMutation(),
  useSignupMutation: () => mockSignupMutation(),
}));

describe("LoginPage", () => {
  beforeEach(() => {
    mockLoginMutation.mockReturnValue({ mutateAsync: vi.fn(), isPending: false });
    mockSignupMutation.mockReturnValue({ mutateAsync: vi.fn(), isPending: false });
  });

  it("provides labelled login fields", () => {
    renderWithProviders(<LoginPage />, { initialEntries: ["/auth/login"] });

    expect(screen.getByLabelText(/email address/i)).toHaveAttribute(
      "autocomplete",
      "email",
    );
    expect(screen.getByLabelText(/^password$/i)).toHaveAttribute(
      "autocomplete",
      "current-password",
    );
  });

  it("shows responsive labelled registration fields without duplicate errors", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />, { initialEntries: ["/auth/login"] });

    await user.click(screen.getByRole("tab", { name: /register/i }));

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^confirm password$/i)).toBeInTheDocument();
    expect(screen.queryAllByText(/password is required/i)).toHaveLength(0);
  });
});
