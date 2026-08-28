import { screen } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../test/renderApp";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

const { mockUseShowProfile } = vi.hoisted(() => ({
  mockUseShowProfile: vi.fn(),
}));

vi.mock("../hooks/profile/useShowProfile", () => ({
  useShowProfile: mockUseShowProfile,
}));

const GuardRoutes = () => (
  <Routes>
    <Route element={<ProtectedRoute />}>
      <Route path="/private" element={<p>Protected content</p>} />
    </Route>
    <Route element={<PublicRoute />}>
      <Route path="/auth/login" element={<p>Public content</p>} />
    </Route>
    <Route path="/feed" element={<p>Feed content</p>} />
  </Routes>
);

describe("route guards", () => {
  beforeEach(() => mockUseShowProfile.mockReset());

  it("announces while the session is loading", () => {
    mockUseShowProfile.mockReturnValue({ data: undefined, isLoading: true });
    renderWithProviders(<GuardRoutes />, { initialEntries: ["/private"] });

    expect(
      screen.getByRole("status", { name: /checking your session/i }),
    ).toBeInTheDocument();
  });

  it("renders protected content for an authenticated user", () => {
    mockUseShowProfile.mockReturnValue({ data: { _id: "user-1" }, isLoading: false });
    renderWithProviders(<GuardRoutes />, { initialEntries: ["/private"] });

    expect(screen.getByText("Protected content")).toBeInTheDocument();
  });

  it("redirects an unauthenticated user to login", () => {
    mockUseShowProfile.mockReturnValue({ data: undefined, isLoading: false });
    renderWithProviders(<GuardRoutes />, { initialEntries: ["/private"] });

    expect(screen.getByText("Public content")).toBeInTheDocument();
  });

  it("redirects an authenticated user away from login", () => {
    mockUseShowProfile.mockReturnValue({ data: { _id: "user-1" }, isLoading: false });
    renderWithProviders(<GuardRoutes />, { initialEntries: ["/auth/login"] });

    expect(screen.getByText("Feed content")).toBeInTheDocument();
  });
});
