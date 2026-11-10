<<<<<<< HEAD
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { FiAlertCircle, FiCode, FiUsers } from "react-icons/fi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
=======
import { useState } from "react";
import { Field, Form, Formik } from "formik";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FiAlertCircle, FiMail, FiUser } from "react-icons/fi";

>>>>>>> a489968 (fix: update frontend code overall and remove bugs)
import PasswordInput from "../../components/common/PasswordInput";
import {
  useLoginMutation,
  useSignupMutation,
} from "../../hooks/auth/useAuthMutation";
<<<<<<< HEAD
import { getErrorMessage } from "../../services/apiError";
import { ROUTES } from "../../utils/constants";
import { loginSchema, registerSchema } from "../../utils/validation";

const initialValues = {
=======
import { loginSchema, registerSchema } from "../../utils/validation";

const AUTH_MODE = {
  LOGIN: "login",
  REGISTER: "register",
};

const LOGIN_INITIAL_VALUES = {
  email: "",
  password: "",
};

const REGISTER_INITIAL_VALUES = {
>>>>>>> a489968 (fix: update frontend code overall and remove bugs)
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

<<<<<<< HEAD
const TextInput = ({ name, label, type = "text", autoComplete, placeholder }) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={name} className="text-xs font-medium">
      {label}
    </label>
    <Field name={name}>
      {({ field, meta }) => (
        <input
          {...field}
          id={name}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={meta.touched && Boolean(meta.error)}
          aria-describedby={meta.touched && meta.error ? `${name}-error` : undefined}
          className={`input input-bordered w-full ${meta.touched && meta.error ? "input-error" : ""}`}
        />
      )}
    </Field>
    <ErrorMessage name={name}>
      {(message) => (
        <p id={`${name}-error`} className="text-xs text-error">
          {message}
        </p>
      )}
    </ErrorMessage>
  </div>
);

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [serverError, setServerError] = useState("");
  const loginMutation = useLoginMutation();
  const signupMutation = useSignupMutation();
  const activeMutation = isLogin ? loginMutation : signupMutation;

  const changeMode = (nextIsLogin) => {
    setIsLogin(nextIsLogin);
    setServerError("");
  };

  const handleSubmit = async (values, { resetForm, setErrors }) => {
    setServerError("");

    try {
      if (isLogin) {
        await loginMutation.mutateAsync({
          email: values.email,
          password: values.password,
        });
=======
const FEATURES = [
  "Real-time chat & collaboration",
  "Project discovery & team matching",
  "Knowledge sharing & mentorship",
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
    // Do not let an in-flight response update a different form mode.
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
>>>>>>> a489968 (fix: update frontend code overall and remove bugs)
        toast.success("Welcome back!");
        return;
      }

<<<<<<< HEAD
      await signupMutation.mutateAsync(values);
      toast.success("Account created. You can now sign in.");
      resetForm();
      setIsLogin(true);
    } catch (error) {
      const message = getErrorMessage(
        error,
        isLogin ? "Unable to sign in." : "Unable to create your account.",
      );
      const fieldErrors = error?.response?.data?.errors;

      if (fieldErrors && typeof fieldErrors === "object") {
        setErrors(fieldErrors);
      } else {
        setServerError(message);
      }
=======
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

      // Keep credential failures generic so the UI does not reveal registered emails.
      const message =
        submittedMode === AUTH_MODE.LOGIN
          ? status === 400 || status === 401
            ? "Email or password is incorrect."
            : "Unable to sign in right now. Please try again."
          : responseData?.message ||
            "Unable to create your account. Please try again.";

      setServerError(message);
>>>>>>> a489968 (fix: update frontend code overall and remove bugs)
    }
  };

  return (
<<<<<<< HEAD
    <main className="flex min-h-dvh flex-col overflow-y-auto bg-gradient-to-br from-base-200 to-base-100 lg:flex-row">
      <section className="flex items-center gap-3 bg-primary px-4 py-4 text-primary-content shadow-md lg:hidden">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-content/15">
          <FiCode aria-hidden="true" />
        </div>
        <div>
          <p className="font-semibold">ConnectDev</p>
          <p className="text-xs opacity-80">Build meaningful connections</p>
=======
    <div className="flex min-h-dvh flex-col bg-gradient-to-br from-base-200 to-base-100 lg:flex-row">
      <header className="w-full shrink-0 bg-primary p-4 text-primary-content shadow-md lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
            <FiUser aria-hidden="true" className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-sm font-semibold">DevConnect</h1>
            <p className="text-xs opacity-90">Build meaningful connections</p>
          </div>
        </div>
      </header>

      <aside className="relative hidden w-1/2 items-center justify-center overflow-hidden bg-primary p-12 text-primary-content lg:flex">
        <div aria-hidden="true" className="absolute inset-0 opacity-10">
          <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-white blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white blur-3xl" />
>>>>>>> a489968 (fix: update frontend code overall and remove bugs)
        </div>
      </section>

<<<<<<< HEAD
      <section className="relative hidden w-1/2 items-center justify-center overflow-hidden bg-primary p-12 text-primary-content lg:flex">
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative z-10 max-w-md space-y-7">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-content/15">
            <FiUsers aria-hidden="true" size={30} />
=======
        <div className="relative z-10 max-w-md space-y-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
            <FiUser aria-hidden="true" className="h-8 w-8" />
>>>>>>> a489968 (fix: update frontend code overall and remove bugs)
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-bold leading-tight">
              Meet developers and grow your network
            </h1>
<<<<<<< HEAD
            <p className="leading-relaxed opacity-85">
              Create your developer profile, discover people with shared skills,
              and build useful professional connections.
            </p>
          </div>
          <ul className="space-y-3 text-sm opacity-90">
            {[
              "Discover developers by their profiles and skills",
              "Send and review connection requests",
              "Keep your professional profile up to date",
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-primary-content/70" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-md rounded-2xl bg-base-100 p-5 shadow-xl sm:p-8">
          <header className="mb-5 space-y-2 text-center">
            <h2 className="text-2xl font-bold">
              {isLogin ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-sm text-base-content/60">
              {isLogin
                ? "Sign in to continue to your network."
                : "Add your basic details to get started."}
            </p>
          </header>

          {serverError && (
            <div role="alert" className="mb-4 flex gap-2 rounded-lg border border-error/20 bg-error/10 p-3 text-sm text-error">
              <FiAlertCircle aria-hidden="true" className="mt-0.5 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <div role="tablist" aria-label="Authentication mode" className="mb-5 flex gap-1 rounded-lg bg-base-200 p-1">
            <button
              type="button"
              role="tab"
              aria-selected={isLogin}
              onClick={() => changeMode(true)}
              className={`min-h-11 flex-1 rounded-md text-sm font-medium ${isLogin ? "bg-base-100 text-primary shadow-sm" : "text-base-content/60"}`}
            >
              Login
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={!isLogin}
              onClick={() => changeMode(false)}
              className={`min-h-11 flex-1 rounded-md text-sm font-medium ${!isLogin ? "bg-base-100 text-primary shadow-sm" : "text-base-content/60"}`}
            >
              Register
            </button>
=======
            <p className="text-base leading-relaxed opacity-90">
              Join a thriving community where developers collaborate, share
              knowledge, and build amazing projects together.
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

      <main className="flex flex-1 items-center justify-center overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="my-4 w-full max-w-md rounded-2xl bg-base-100 p-6 shadow-xl sm:p-8">
          <div className="mb-5 space-y-2 text-center">
            <h2 className="text-2xl font-bold">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-sm text-base-content/60">
              {isLogin
                ? "Enter your credentials to access your account"
                : "Fill in your details to get started"}
            </p>
          </div>

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
                    {!isLogin && (
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <TextInputField
                          name="firstName"
                          label="First Name"
                          placeholder="John"
                          autoComplete="given-name"
                        />
                        <TextInputField
                          name="lastName"
                          label="Last Name"
                          placeholder="Doe"
                          autoComplete="family-name"
                        />
                      </div>
                    )}

                    <TextInputField
                      name="email"
                      label="Email Address"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      icon={FiMail}
                    />

                    <div>
                      <label htmlFor="password" className="label py-0 pb-1">
                        <span className="label-text text-xs">Password</span>
                      </label>
                      {/* PasswordInput must forward these attributes to its input. */}
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

                    {!isLogin && (
                      <div>
                        <label
                          htmlFor="confirmPassword"
                          className="label py-0 pb-1"
                        >
                          <span className="label-text text-xs">
                            Confirm Password
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

                    {isLogin && (
                      <div className="text-right">
                        <Link
                          to="/auth/forgot-password"
                          className="text-xs text-primary transition-colors hover:text-primary-focus"
                        >
                          Forgot password?
                        </Link>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitPending}
                      className="btn btn-primary mt-3 w-full"
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
                            ? "Sign In"
                            : "Create Account"}
                      </span>
                    </button>
                  </Form>
                );
              }}
            </Formik>
>>>>>>> a489968 (fix: update frontend code overall and remove bugs)
          </div>

          <Formik
            key={isLogin ? "login" : "register"}
            initialValues={initialValues}
            validationSchema={isLogin ? loginSchema : registerSchema}
            onSubmit={handleSubmit}
          >
            <Form className="space-y-4" noValidate>
              {!isLogin && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <TextInput name="firstName" label="First name" autoComplete="given-name" placeholder="Talha" />
                  <TextInput name="lastName" label="Last name" autoComplete="family-name" placeholder="Ayub" />
                </div>
              )}

              <TextInput name="email" label="Email address" type="email" autoComplete="email" placeholder="you@example.com" />
              <PasswordInput
                name="password"
                label="Password"
                placeholder="Enter your password"
                autoComplete={isLogin ? "current-password" : "new-password"}
              />

              {!isLogin && (
                <PasswordInput
                  name="confirmPassword"
                  label="Confirm password"
                  placeholder="Enter your password again"
                  autoComplete="new-password"
                />
              )}

              {isLogin && (
                <div className="text-right">
                  <Link to={ROUTES.FORGOT_PASSWORD} className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
              )}

              <button type="submit" disabled={activeMutation.isPending} className="btn btn-primary min-h-11 w-full">
                {activeMutation.isPending && <span className="loading loading-spinner loading-sm" />}
                {activeMutation.isPending
                  ? isLogin
                    ? "Signing in..."
                    : "Creating account..."
                  : isLogin
                    ? "Sign in"
                    : "Create account"}
              </button>
            </Form>
          </Formik>
        </div>
<<<<<<< HEAD
      </section>
    </main>
=======
      </main>
    </div>
>>>>>>> a489968 (fix: update frontend code overall and remove bugs)
  );
};

export default LoginPage;
