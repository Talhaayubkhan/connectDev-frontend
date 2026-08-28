import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { FiAlertCircle, FiCode, FiUsers } from "react-icons/fi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import PasswordInput from "../../components/common/PasswordInput";
import {
  useLoginMutation,
  useSignupMutation,
} from "../../hooks/auth/useAuthMutation";
import { getErrorMessage } from "../../services/apiError";
import { ROUTES } from "../../utils/constants";
import { loginSchema, registerSchema } from "../../utils/validation";

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

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
        toast.success("Welcome back!");
        return;
      }

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
    }
  };

  return (
    <main className="flex min-h-dvh flex-col overflow-y-auto bg-gradient-to-br from-base-200 to-base-100 lg:flex-row">
      <section className="flex items-center gap-3 bg-primary px-4 py-4 text-primary-content shadow-md lg:hidden">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-content/15">
          <FiCode aria-hidden="true" />
        </div>
        <div>
          <p className="font-semibold">ConnectDev</p>
          <p className="text-xs opacity-80">Build meaningful connections</p>
        </div>
      </section>

      <section className="relative hidden w-1/2 items-center justify-center overflow-hidden bg-primary p-12 text-primary-content lg:flex">
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative z-10 max-w-md space-y-7">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-content/15">
            <FiUsers aria-hidden="true" size={30} />
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-bold leading-tight">
              Meet developers and grow your network
            </h1>
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
      </section>
    </main>
  );
};

export default LoginPage;
