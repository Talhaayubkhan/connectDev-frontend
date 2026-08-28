import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import PopUp from "./PopUp";

const PopupFixture = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open logout
      </button>
      {open && (
        <PopUp
          message="Sign in again later."
          onCancel={() => setOpen(false)}
          onConfirm={vi.fn()}
        />
      )}
    </>
  );
};

describe("PopUp", () => {
  it("supports dialog focus, Escape, and focus restoration", async () => {
    const user = userEvent.setup();
    render(<PopupFixture />);
    const trigger = screen.getByRole("button", { name: /open logout/i });

    await user.click(trigger);
    expect(
      screen.getByRole("dialog", { name: /log out/i }),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /cancel/i })).toHaveFocus(),
    );

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
