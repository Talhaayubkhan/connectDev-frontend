import { useState } from "react";
import { Form, Formik } from "formik";
import { FiAlertCircle, FiCode, FiMail, FiUsers } from "react-icons/fi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import PasswordInput from "../../components/common/PasswordInput";
import {
  useLoginMutation,
  useSignupMutation,
} from "../../hooks/auth/useAuthMutation";
import { loginSchema, registerSchema } from "../../utils/validation";
import {
  AUTH_MODE,
  FEATURES,
  LOGIN_INITIAL_VALUES,
  REGISTER_INITIAL_VALUES,
  ROUTES,
  STATS,
} from "../../utils/constants";
import TextInputField from "../../components/common/TextInputFields";

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

      await signupMutation.mutateAsync({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
        confirmPassword: values.confirmPassword,
      });

      resetForm();
      toast.success("Account created successfully! Please sign in.");
      setMode(AUTH_MODE.LOGIN);
    } catch (error) {
      const responseData = error?.response?.data;
      const status = error?.response?.status;

      // Display backend validation errors through Formik.
      if (submittedMode === AUTH_MODE.REGISTER && responseData?.errors) {
        setErrors(responseData.errors);
        return;
      }

      // Display general server errors.
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
              {({ isSubmitting }) => {
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
                    <PasswordInput
                      name="password"
                      label="Password"
                      placeholder="Enter your password"
                      autoComplete={
                        isLogin ? "current-password" : "new-password"
                      }
                    />

                    {/* Confirm password */}
                    {!isLogin && (
                      <PasswordInput
                        name="confirmPassword"
                        label="Confirm password"
                        placeholder="Confirm your password"
                        autoComplete="new-password"
                      />
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
