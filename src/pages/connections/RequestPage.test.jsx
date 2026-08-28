import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../test/renderApp";
import RequestsPage from "./RequestPage";

const { mockUseRequests, mockUseReview } = vi.hoisted(() => ({
  mockUseRequests: vi.fn(),
  mockUseReview: vi.fn(),
}));

vi.mock("../../hooks/connections/useConnections", () => ({
  useConnectionRequests: mockUseRequests,
  useReviewConnectionRequest: mockUseReview,
}));

describe("RequestsPage", () => {
  const mutate = vi.fn();

  beforeEach(() => {
    mutate.mockReset();
    mockUseRequests.mockReturnValue({
      data: [
        {
          _id: "request-1",
          senderUserId: {
            _id: "user-1",
            firstName: "Grace",
            lastName: "Hopper",
          },
        },
      ],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
    mockUseReview.mockReturnValue({ mutate });
  });

  it("shows the pending state on the action that was selected", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RequestsPage />);

    const acceptButton = screen.getByRole("button", { name: /accept/i });
    await user.click(acceptButton);

    expect(mutate).toHaveBeenCalledWith(
      { status: "accepted", requestId: "request-1" },
      expect.any(Object),
    );
    expect(
      within(acceptButton).getByRole("status", { name: /accepting request/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /decline/i })).toBeDisabled();
  });
});
