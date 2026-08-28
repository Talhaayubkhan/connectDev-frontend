import * as Yup from "yup";

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

// Browser inputs return an empty string for optional fields.
const optionalUrl = Yup.string()
  .transform((value) => (value === "" ? null : value))
  .nullable()
  .url("Please enter a valid URL");

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

export const changePasswordSchema = Yup.object({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: passwordRules,
  confirmPassword: confirmPassword("newPassword"),
});

export const resetPasswordSchema = Yup.object({
  newPassword: passwordRules,
  confirmPassword: confirmPassword("newPassword"),
});

export const editProfileSchema = Yup.object({
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

  age: Yup.number()
    .transform((value, original) => (original === "" ? undefined : value))
    .typeError("Age must be a number")
    .min(18, "You must be at least 18 years old")
    .max(100, "Please enter a valid age")
    .integer("Age must be a whole number")
    .optional(),

  gender: Yup.string()
    .transform((value) => (value === "" ? undefined : value))
    .oneOf(["male", "female", "other"], "Please select a valid gender option")
    .optional(),

  photoURL: optionalUrl,

  about: Yup.string()
    .trim()
    .max(300, "Bio cannot exceed 300 characters")
    .nullable(),

  location: Yup.string()
    .trim()
    .max(100, "Location cannot exceed 100 characters")
    .nullable(),

  occupation: Yup.string()
    .trim()
    .max(100, "Occupation cannot exceed 100 characters")
    .nullable(),

  skills: Yup.array()
    .of(
      Yup.string()
        .trim()
        .min(1, "Skill cannot be empty")
        .max(30, "Skill name too long"),
    )
    .max(15, "You can add up to 15 skills only")
    .test("no-duplicates", "Duplicate skills are not allowed", (arr) => {
      if (!arr || arr.length === 0) return true;
      const normalizedSkills = arr.map((skill) => skill.trim().toLowerCase());
      return new Set(normalizedSkills).size === normalizedSkills.length;
    })
    .nullable(),
});

export const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .trim()
    .lowercase()
    .email("Please enter a valid email address")
    .required("Email address is required"),
});

export default {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  resetPasswordSchema,
  editProfileSchema,
  forgotPasswordSchema,
};
