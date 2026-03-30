// import * as Yup from "yup";

// export const registerSchema = Yup.object().shape({
//   firstName: Yup.string().min(2).max(50).required("First name is required"),
//   lastName: Yup.string().min(2).max(50),
//   email: Yup.string().email("Invalid email").required("Email is required"),
//   password: Yup.string()
//     .min(8, "Password too short")
//     .matches(/[A-Z]/, "Must contain uppercase")
//     .matches(/[0-9]/, "Must contain a number")
//     .required("Password is required"),
//   confirmPassword: Yup.string()
//     .oneOf([Yup.ref("password"), null], "Passwords must match")
//     .required("Confirm password is required"),
// });

// export const loginSchema = Yup.object().shape({
//   email: Yup.string().email("Invalid email").required("Email is required"),
//   password: Yup.string().required("Password is required"),
// });
// export const confirmPasswordSchema = Yup.object().shape({
//   currentPassword: Yup.string().required("Current password is required"),
//   newPassword: Yup.string()
//     .min(8, "Password must be at least 8 characters")
//     .matches(/[A-Z]/, "Must contain at least one uppercase letter")
//     .matches(/[0-9]/, "Must contain at least one number")
//     .required("New password is required"),
//   confirmPassword: Yup.string()
//     .oneOf([Yup.ref("newPassword"), null], "Passwords must match") // ✅ fixed ref
//     .required("Confirm password is required"),
// });

// export const validateEditProfileSchema = Yup.object().shape({
//   firstName: Yup.string()
//     .min(2, "First name must be at least 2 characters")
//     .max(30, "First name too long")
//     .required("First name is required"),

//   lastName: Yup.string()
//     .min(2, "Last name must be at least 2 characters")
//     .max(30, "Last name too long")
//     .required("Last name is required"),

//   age: Yup.number()
//     .min(18, "You must be at least 18")
//     .max(100, "Invalid age")
//     .positive("Age cannot be negative")
//     .integer("Age must be a whole number")
//     .required("Age is required"),

//   gender: Yup.string()
//     .oneOf(["male", "female", "other"], "Please select a valid gender")
//     .required("Gender is required"),

//   photoURL: Yup.string().url("Must be a valid URL").nullable(),

//   about: Yup.string().max(300, "Bio cannot exceed 300 characters").nullable(),

//   skills: Yup.array()
//     .of(Yup.string().min(1))
//     .max(10, "You can add up to 10 skills only")
//     .nullable(),
// });

// export const forgotPasswordSchema = Yup.object({
//   email: Yup.string().email("Invalid email").required("Email is required"),
// });
// export const resetPasswordSchema = Yup.object({
//   newPassword: Yup.string()
//     .min(8, "Min 8 characters")
//     .matches(/[A-Z]/, "Must contain at least one uppercase letter")
//     .matches(/[0-9]/, "Must contain at least one number")
//     .required("Password is required"),
//   confirmPassword: Yup.string()
//     .oneOf([Yup.ref("newPassword")], "Passwords must match")
//     .required("Please confirm your password"),
// });

import * as Yup from "yup";

// reusable rules
const passwordRules = Yup.string()
  .min(8, "Password must be at least 8 characters")
  .matches(/[A-Z]/, "Must contain uppercase letter")
  .matches(/[0-9]/, "Must contain a number")
  .required("Password is required");

const confirmPassword = (ref = "password") =>
  Yup.string()
    .oneOf([Yup.ref(ref)], "Passwords must match")
    .required("Confirm password is required");

// ================= AUTH =================

export const registerSchema = Yup.object({
  firstName: Yup.string().trim().min(2).max(50).required(),
  lastName: Yup.string().trim().min(2).max(50).nullable(),

  email: Yup.string().trim().lowercase().email("Invalid email").required(),

  password: passwordRules,
  confirmPassword: confirmPassword("password"),
});

export const loginSchema = Yup.object({
  email: Yup.string().trim().lowercase().email().required(),
  password: Yup.string().required(),
});

// ================= PASSWORD =================

export const changePasswordSchema = Yup.object({
  currentPassword: Yup.string().required(),
  newPassword: passwordRules,
  confirmPassword: confirmPassword("newPassword"),
});

export const resetPasswordSchema = Yup.object({
  newPassword: passwordRules,
  confirmPassword: confirmPassword("newPassword"),
});

// ================= PROFILE =================

export const editProfileSchema = Yup.object({
  firstName: Yup.string().trim().min(2).max(50).required(),
  lastName: Yup.string().trim().min(2).max(50).required(),

  age: Yup.number()
    .typeError("Age must be a number")
    .min(18)
    .max(100)
    .integer()
    .required(),

  gender: Yup.string().oneOf(["male", "female", "other"]).required(),

  photoURL: Yup.string().url().nullable(),

  about: Yup.string().trim().max(300).nullable(),

  skills: Yup.array()
    .of(Yup.string().trim().min(2))
    .max(20)
    .test("no-duplicates", "Duplicate skills not allowed", (arr) => {
      if (!arr) return true;
      return new Set(arr).size === arr.length;
    })
    .nullable(),
});

// ================= FORGOT =================

export const forgotPasswordSchema = Yup.object({
  email: Yup.string().trim().lowercase().email().required(),
});
