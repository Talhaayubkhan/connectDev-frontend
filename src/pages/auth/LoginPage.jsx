import { useState } from "react";
import { Field, Form, Formik } from "formik";
import { FiAlertCircle, FiCode, FiMail, FiUsers } from "react-icons/fi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import PasswordInput from "../../components/common/PasswordInput";
import {
  useLoginMutation,
  useSignupMutation,
} from "../../hooks/auth/useAuthMutation";
import { loginSchema, registerSchema } from "../../utils/validation";
import { ROUTES } from "../../utils/constants";

const AUTH_MODE = {
  LOGIN: "login",
  REGISTER: "register",
};

const LOGIN_INITIAL_VALUES = {
  email: "",
  password: "",
};

const REGISTER_INITIAL_VALUES = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const FEATURES = [
  "Real-time chat and collaboration",
  "Project discovery and team matching",
  "Knowledge sharing and mentorship",
];

const STATS = [
  { value: "5K+", label: "Active Members" },
  { value: "200+", label: "Projects" },
  { value: "50+", label: "Countries" },
];

const normalizeFieldErrors = (apiErrors, formValues) => {
  if (!apiErrors || typeof apiErrors !== "object" || Array.isArray(apiErrors)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(apiErrors)
      .filter(([fieldName]) =>
        Object.prototype.hasOwnProperty.call(formValues, fieldName),
      )
      .map(([fieldName, message]) => [
        fieldName,
        Array.isArray(message) ? message.join(" ") : String(message),
      ]),
  );
};

const FieldError = ({ id, message }) => {
  if (!message) return null;

  return (
    <div
      id={id}
      role="alert"
      className="mt-1 flex items-center gap-1 text-xs text-error"
    >
      <FiAlertCircle aria-hidden="true" className="h-3 w-3 shrink-0" />

      <span>{message}</span>
    </div>
  );
};

const TextInputField = ({
  name,
  label,
  type = "text",
  placeholder,
  autoComplete,
  icon: Icon,
}) => (
  <Field name={name}>
    {({ field, meta }) => {
      const hasError = Boolean(meta.touched && meta.error);
      const errorId = `${name}-error`;

      return (
        <div>
          <label htmlFor={name} className="label py-0 pb-1">
            <span className="label-text text-xs">{label}</span>
          </label>

          <div className={Icon ? "relative" : undefined}>
            {Icon && (
              <Icon
                aria-hidden="true"
                className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-sm text-base-content/40"
              />
            )}

            <input
              {...field}
              id={name}
              type={type}
              placeholder={placeholder}
              autoComplete={autoComplete}
              aria-invalid={hasError}
              aria-describedby={hasError ? errorId : undefined}
              spellCheck={type === "email" ? false : undefined}
              className={`input input-bordered w-full ${
                Icon ? "pl-9" : ""
              } ${hasError ? "input-error" : ""}`}
            />
          </div>

          <FieldError id={errorId} message={hasError ? meta.error : null} />
        </div>
      );
    }}
  </Field>
);

const LoginPage = () => {
  const [mode, setMode] = useState(AUTH_MODE.LOGIN);
  const [serverError, setServerError] = useState(null);

  const loginMutation = useLoginMutation();
  const signupMutation = useSignupMutation();

  const isLogin = mode === AUTH_MODE.LOGIN;

  const isAnyRequestPending =
    loginMutation.isPending || signupMutation.isPending;

  const changeMode = (nextMode) => {
    if (isAnyRequestPending || nextMode === mode) return;

    setServerError(null);
    setMode(nextMode);
  };

  const handleSubmit = async (values, { resetForm, setErrors }) => {
    const submittedMode = mode;

    setServerError(null);

    try {
      if (submittedMode === AUTH_MODE.LOGIN) {
        await loginMutation.mutateAsync({
          email: values.email.trim().toLowerCase(),
          password: values.password,
        });

        resetForm();
        toast.success("Welcome back!");

        return;
      }

      const registrationPayload = {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
        confirmPassword: values.confirmPassword,
      };

      await signupMutation.mutateAsync(registrationPayload);

      resetForm();

      toast.success("Account created successfully! Please sign in.");

      setMode(AUTH_MODE.LOGIN);
    } catch (error) {
      const responseData = error?.response?.data;
      const status = error?.response?.status;

      if (submittedMode === AUTH_MODE.REGISTER) {
        const fieldErrors = normalizeFieldErrors(responseData?.errors, values);

        if (Object.keys(fieldErrors).length > 0) {
          setErrors(fieldErrors);
          return;
        }
      }

      // Keep login errors generic to avoid revealing registered emails.
      const message =
        submittedMode === AUTH_MODE.LOGIN
          ? status === 400 || status === 401
            ? "Email or password is incorrect."
            : "Unable to sign in right now. Please try again."
          : responseData?.message ||
            "Unable to create your account. Please try again.";

      setServerError(message);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col bg-gradient-to-br from-base-200 to-base-100 lg:flex-row">
      {/* Mobile header */}
      <header className="w-full shrink-0 bg-primary p-4 text-primary-content shadow-md lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
            <FiCode aria-hidden="true" className="h-4 w-4" />
          </div>

          <div>
            <h1 className="text-sm font-semibold">ConnectDev</h1>
            <p className="text-xs opacity-90">Build meaningful connections</p>
          </div>
        </div>
      </header>

      {/* Desktop information panel */}
      <aside className="relative hidden w-1/2 items-center justify-center overflow-hidden bg-primary p-12 text-primary-content lg:flex">
        <div aria-hidden="true" className="absolute inset-0 opacity-10">
          <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-white blur-3xl" />

          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-white blur-3xl" />

          <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white blur-3xl" />
        </div>

        <div className="relative z-10 max-w-md space-y-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
            <FiUsers aria-hidden="true" className="h-8 w-8" />
          </div>

          <div className="space-y-3">
            <h2 className="text-4xl font-bold leading-tight">
              Meet developers and grow your network
            </h2>

            <p className="text-base leading-relaxed opacity-90">
              Join a community where developers collaborate, share knowledge,
              and build projects together.
            </p>
          </div>

          <ul className="space-y-3 pt-4">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-white/60"
                />

                <span className="text-sm opacity-90">{feature}</span>
              </li>
            ))}
          </ul>

          <dl className="flex gap-8 border-t border-white/20 pt-6">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <dd className="text-2xl font-bold">{value}</dd>
                <dt className="text-xs opacity-70">{label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </aside>

      {/* Authentication form */}
      <main className="flex flex-1 items-center justify-center overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="my-4 w-full max-w-md rounded-2xl bg-base-100 p-6 shadow-xl sm:p-8">
          <div className="mb-5 space-y-2 text-center">
            <h2 className="text-2xl font-bold">
              {isLogin ? "Welcome back" : "Create your account"}
            </h2>

            <p className="text-sm text-base-content/60">
              {isLogin
                ? "Enter your credentials to access your account."
                : "Fill in your details to get started."}
            </p>
          </div>

          {/* Server error */}
          {serverError && (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-error/20 bg-error/10 p-3"
            >
              <div className="flex items-center gap-2 text-sm text-error">
                <FiAlertCircle
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0"
                />

                <span>{serverError}</span>
              </div>
            </div>
          )}

          {/* Login / Register tabs */}
          <div
            role="tablist"
            aria-label="Authentication method"
            className="mb-5 flex gap-2 rounded-lg bg-base-200 p-1"
          >
            {[
              { mode: AUTH_MODE.LOGIN, label: "Login" },
              { mode: AUTH_MODE.REGISTER, label: "Register" },
            ].map((tab) => {
              const isActive = mode === tab.mode;

              return (
                <button
                  key={tab.mode}
                  id={`${tab.mode}-tab`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="auth-form-panel"
                  disabled={isAnyRequestPending}
                  onClick={() => changeMode(tab.mode)}
                  className={`flex-1 rounded-md py-2 text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
                    isActive
                      ? "bg-base-100 text-primary shadow-sm"
                      : "text-base-content/60 hover:text-base-content"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Form panel */}
          <div
            id="auth-form-panel"
            role="tabpanel"
            aria-labelledby={`${mode}-tab`}
          >
            <Formik
              key={mode}
              initialValues={
                isLogin ? LOGIN_INITIAL_VALUES : REGISTER_INITIAL_VALUES
              }
              validationSchema={isLogin ? loginSchema : registerSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting }) => {
                const passwordHasError = Boolean(
                  touched.password && errors.password,
                );

                const confirmPasswordHasError = Boolean(
                  touched.confirmPassword && errors.confirmPassword,
                );

                const submitPending = isSubmitting || isAnyRequestPending;

                return (
                  <Form noValidate className="space-y-3">
                    {/* Registration fields */}
                    {!isLogin && (
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <TextInputField
                          name="firstName"
                          label="First name"
                          placeholder="John"
                          autoComplete="given-name"
                        />

                        <TextInputField
                          name="lastName"
                          label="Last name"
                          placeholder="Doe"
                          autoComplete="family-name"
                        />
                      </div>
                    )}

                    {/* Email */}
                    <TextInputField
                      name="email"
                      label="Email address"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      icon={FiMail}
                    />

                    {/* Password */}
                    <div>
                      <label htmlFor="password" className="label py-0 pb-1">
                        <span className="label-text text-xs">Password</span>
                      </label>

                      <PasswordInput
                        password="password"
                        id="password"
                        placeholder="Enter your password"
                        autoComplete={
                          isLogin ? "current-password" : "new-password"
                        }
                        aria-invalid={passwordHasError}
                        aria-describedby={
                          passwordHasError ? "password-error" : undefined
                        }
                      />

                      <FieldError
                        id="password-error"
                        message={passwordHasError ? errors.password : null}
                      />
                    </div>

                    {/* Confirm password */}
                    {!isLogin && (
                      <div>
                        <label
                          htmlFor="confirmPassword"
                          className="label py-0 pb-1"
                        >
                          <span className="label-text text-xs">
                            Confirm password
                          </span>
                        </label>

                        <PasswordInput
                          password="confirmPassword"
                          id="confirmPassword"
                          placeholder="Confirm your password"
                          autoComplete="new-password"
                          aria-invalid={confirmPasswordHasError}
                          aria-describedby={
                            confirmPasswordHasError
                              ? "confirmPassword-error"
                              : undefined
                          }
                        />

                        <FieldError
                          id="confirmPassword-error"
                          message={
                            confirmPasswordHasError
                              ? errors.confirmPassword
                              : null
                          }
                        />
                      </div>
                    )}

                    {/* Forgot password */}
                    {isLogin && (
                      <div className="text-right">
                        <Link
                          to={ROUTES.FORGOT_PASSWORD}
                          className="text-xs text-primary transition-colors hover:text-primary-focus"
                        >
                          Forgot password?
                        </Link>
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={submitPending}
                      className="btn btn-primary mt-3 min-h-11 w-full"
                    >
                      {submitPending && (
                        <span
                          aria-hidden="true"
                          className="loading loading-spinner loading-sm"
                        />
                      )}

                      <span>
                        {submitPending
                          ? isLogin
                            ? "Signing in..."
                            : "Creating account..."
                          : isLogin
                            ? "Sign in"
                            : "Create account"}
                      </span>
                    </button>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
