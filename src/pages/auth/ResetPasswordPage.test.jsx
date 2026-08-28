import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../test/renderApp";
import ResetPasswordPage from "./ResetPasswordPage";

const { mockMutate, mockUseResetPasswordMutation } = vi.hoisted(() => ({
  mockMutate: vi.fn(),
  mockUseResetPasswordMutation: vi.fn(),
}));

vi.mock("../../hooks/auth/useAuthMutation", () => ({
  useResetPasswordMutation: mockUseResetPasswordMutation,
}));

describe("ResetPasswordPage", () => {
  beforeEach(() => {
    mockMutate.mockReset();
    mockUseResetPasswordMutation.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
  });

  it("submits both password values with the token", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ResetPasswordPage />, {
      initialEntries: ["/auth/reset-password?token=valid-token"],
    });

    await user.type(screen.getByLabelText(/^new password$/i), "StrongPass1");
    await user.type(
      screen.getByLabelText(/^confirm new password$/i),
      "StrongPass1",
    );
    await user.click(screen.getByRole("button", { name: /^reset password$/i }));

    await waitFor(() =>
      expect(mockMutate).toHaveBeenCalledWith(
        {
          token: "valid-token",
          newPassword: "StrongPass1",
          confirmPassword: "StrongPass1",
        },
        expect.any(Object),
      ),
    );
  });
});
