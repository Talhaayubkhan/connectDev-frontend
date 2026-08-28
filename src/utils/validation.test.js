import { describe, expect, it } from "vitest";
import {
  editProfileSchema,
  registerSchema,
  resetPasswordSchema,
} from "./validation";

describe("validation schemas", () => {
  it("requires a strong password", async () => {
    await expect(
      registerSchema.validate({
        firstName: "Talha",
        lastName: "Ayub",
        email: "talha@example.com",
        password: "weak",
        confirmPassword: "weak",
      }),
    ).rejects.toThrow(/at least 8 characters/i);
  });

  it("requires matching reset passwords", async () => {
    await expect(
      resetPasswordSchema.validate({
        newPassword: "StrongPass1",
        confirmPassword: "DifferentPass1",
      }),
    ).rejects.toThrow(/passwords must match/i);
  });

  it("allows an empty optional profile URL", async () => {
    await expect(
      editProfileSchema.validate({
        firstName: "Talha",
        lastName: "Ayub",
        gender: "male",
        photoURL: "",
        skills: [],
      }),
    ).resolves.toMatchObject({ photoURL: null });
  });

  it("allows gender to remain optional in the profile form", async () => {
    await expect(
      editProfileSchema.validate({
        firstName: "Talha",
        lastName: "Ayub",
        gender: "",
        skills: [],
      }),
    ).resolves.toMatchObject({ firstName: "Talha" });
  });

  it("rejects duplicate skills regardless of letter casing", async () => {
    await expect(
      editProfileSchema.validate({
        firstName: "Talha",
        lastName: "Ayub",
        gender: "male",
        skills: ["React", "react"],
      }),
    ).rejects.toThrow(/duplicate skills/i);
  });
});
