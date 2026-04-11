import * as Yup from "yup";

// ================= REUSABLE RULES =================

const passwordRules = Yup.string()
  .min(8, "Password must be at least 8 characters")
  .matches(/[A-Z]/, "Must contain at least one uppercase letter")
  .matches(/[0-9]/, "Must contain at least one number")
  .matches(/[a-z]/, "Must contain at least one lowercase letter")
  .required("Password is required");

const confirmPassword = (ref = "password") =>
  Yup.string()
    .oneOf([Yup.ref(ref)], "Passwords must match")
    .required("Please confirm your password");

// Helper for optional URL fields (handles empty strings)
const optionalUrl = Yup.string()
  .transform((value) => (value === "" ? null : value))
  .nullable()
  .url("Please enter a valid URL");

// ================= AUTH SCHEMAS =================

export const registerSchema = Yup.object({
  firstName: Yup.string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters")
    .required("First name is required"),

  lastName: Yup.string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name cannot exceed 50 characters")
    .nullable(),

  email: Yup.string()
    .trim()
    .lowercase()
    .email("Please enter a valid email address")
    .required("Email is required"),

  password: passwordRules,
  confirmPassword: confirmPassword("password"),
});

export const loginSchema = Yup.object({
  email: Yup.string()
    .trim()
    .lowercase()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

// ================= PASSWORD SCHEMAS =================

export const changePasswordSchema = Yup.object({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: passwordRules,
  confirmPassword: confirmPassword("newPassword"),
});

export const resetPasswordSchema = Yup.object({
  newPassword: passwordRules,
  confirmPassword: confirmPassword("newPassword"),
});

// ================= PROFILE SCHEMA (FIXED & COMPLETE) =================

export const editProfileSchema = Yup.object({
  // Basic Info
  firstName: Yup.string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters")
    .required("First name is required"),

  lastName: Yup.string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name cannot exceed 50 characters")
    .required("Last name is required"),

  // NEW: Email field (user can update email)
  email: Yup.string()
    .trim()
    .lowercase()
    .email("Please enter a valid email address")
    .required("Email address is required"),

  // Age
  age: Yup.number()
    .typeError("Age must be a number")
    .min(18, "You must be at least 18 years old")
    .max(100, "Please enter a valid age (max 100)")
    .integer("Age must be a whole number")
    .required("Age is required"),

  // Gender
  gender: Yup.string()
    .oneOf(["male", "female", "other"], "Please select a valid gender option")
    .required("Gender is required"),

  // Photo URL - FIXED: handles empty string
  photoURL: optionalUrl,

  // About/Bio
  about: Yup.string()
    .trim()
    .max(300, "Bio cannot exceed 300 characters")
    .nullable(),

  // add inside your editProfileSchema Yup object:
  location: Yup.string().max(100, "Max 100 characters").optional(),
  occupation: Yup.string().max(100, "Max 100 characters").optional(),

  // Skills - UPDATED: max 15 to match backend, min 1 character
  skills: Yup.array()
    .of(
      Yup.string()
        .trim()
        .min(1, "Skill cannot be empty")
        .max(30, "Skill name too long"),
    )
    .max(15, "You can add up to 15 skills only") // Changed from 20 to 15
    .test("no-duplicates", "Duplicate skills are not allowed", (arr) => {
      if (!arr || arr.length === 0) return true;
      const uniqueSkills = new Set(arr);
      return uniqueSkills.size === arr.length;
    })
    .nullable(),
});

// ================= FORGOT PASSWORD =================

export const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .trim()
    .lowercase()
    .email("Please enter a valid email address")
    .required("Email address is required"),
});

// ================= OPTIONAL: EXPORT ALL SCHEMAS =================

const validationSchemas = {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  resetPasswordSchema,
  editProfileSchema,
  forgotPasswordSchema,
};

export default validationSchemas;
