import { useState, useRef, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link } from "react-router-dom";
import { loginSchema, registerSchema } from "../../utils/validation";
import PasswordInput from "../../components/common/PasswordInput";
import {
  useLoginMutation,
  useSignupMutation,
} from "../../hooks/auth/useAuthMutation";
import { toast } from "react-toastify";
import { FiUser, FiMail, FiAlertCircle } from "react-icons/fi";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [serverError, setServerError] = useState(null);
  const formikRef = useRef(null);

  const loginMutation = useLoginMutation();
  const registerMutation = useSignupMutation();

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  useEffect(() => {
    if (formikRef.current) {
      formikRef.current.resetForm();
      setServerError(null);
    }
  }, [isLogin]);

  const handleSubmit = async (
    values,
    { resetForm, setSubmitting, setErrors },
  ) => {
    setServerError(null);

    try {
      if (isLogin) {
        await loginMutation.mutateAsync(
          { email: values.email, password: values.password },
          {
            onSuccess: () => {
              resetForm();
              toast.success("Welcome back!");
            },
            onError: (error) => {
              const errorMessage =
                error?.response?.data?.message || "Login failed";
              setServerError(errorMessage);

              if (errorMessage.toLowerCase().includes("email")) {
                setErrors({ email: errorMessage });
              } else if (errorMessage.toLowerCase().includes("password")) {
                setErrors({ password: errorMessage });
              } else {
                toast.error(errorMessage);
              }
            },
          },
        );
      } else {
        await registerMutation.mutateAsync(values, {
          onSuccess: () => {
            toast.success("Account created successfully! Please sign in.");
            resetForm();
            setIsLogin(true);
          },
          onError: (error) => {
            const errorMessage =
              error?.response?.data?.message || "Registration failed";
            setServerError(errorMessage);

            if (error?.response?.data?.errors) {
              const fieldErrors = error.response.data.errors;
              Object.keys(fieldErrors).forEach((key) => {
                if (key in values) {
                  setErrors({ [key]: fieldErrors[key] });
                }
              });
            } else {
              toast.error(errorMessage);
            }
          },
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const isPending = loginMutation.isPending || registerMutation.isPending;

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-base-200 to-base-100 flex flex-col lg:flex-row">
      {/* Mobile Banner */}
      <div className="lg:hidden w-full bg-primary text-white p-4 shadow-md flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/20">
            <FiUser className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-semibold">DevConnect</h1>
            <p className="text-xs opacity-90">Build meaningful connections</p>
          </div>
        </div>
      </div>

      {/* LEFT SIDE - Hero Section (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary text-white p-12 items-center justify-center">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-md space-y-8">
          <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
            <FiUser className="w-8 h-8" />
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold leading-tight">
              Connect with
              <span className="block text-primary-content/90">
                Developers Worldwide
              </span>
            </h1>
            <p className="text-base opacity-90 leading-relaxed">
              Join a thriving community where developers collaborate, share
              knowledge, and build amazing projects together.
            </p>
          </div>

          <div className="space-y-3 pt-4">
            {[
              "Real-time chat & collaboration",
              "Project discovery & team matching",
              "Knowledge sharing & mentorship",
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
                <span className="text-sm opacity-90">{feature}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-8 pt-6 border-t border-white/20">
            <div>
              <div className="text-2xl font-bold">5K+</div>
              <div className="text-xs opacity-70">Active Members</div>
            </div>
            <div>
              <div className="text-2xl font-bold">200+</div>
              <div className="text-xs opacity-70">Projects</div>
            </div>
            <div>
              <div className="text-2xl font-bold">50+</div>
              <div className="text-xs opacity-70">Countries</div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Form Section */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">
        <div className="w-full max-w-md">
          <div className="bg-base-100 rounded-2xl shadow-xl p-6 sm:p-8">
            {/* Header */}
            <div className="text-center space-y-2 mb-5">
              <h2 className="text-2xl font-bold">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-sm text-base-content/60">
                {isLogin
                  ? "Enter your credentials to access your account"
                  : "Fill in your details to get started"}
              </p>
            </div>

            {/* Server Error Display */}
            {serverError && (
              <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg">
                <div className="flex items-center gap-2 text-error text-sm">
                  <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{serverError}</span>
                </div>
              </div>
            )}

            {/* Toggle Buttons */}
            <div className="flex gap-2 bg-base-200 rounded-lg p-1 mb-5">
              {["Login", "Register"].map((tab, idx) => {
                const isActive =
                  (idx === 0 && isLogin) || (idx === 1 && !isLogin);
                return (
                  <button
                    key={tab}
                    onClick={() => setIsLogin(idx === 0)}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      isActive
                        ? "bg-base-100 shadow-sm text-primary"
                        : "text-base-content/60 hover:text-base-content"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            <Formik
              innerRef={formikRef}
              initialValues={initialValues}
              validationSchema={isLogin ? loginSchema : registerSchema}
              onSubmit={handleSubmit}
              validateOnChange={true}
              validateOnBlur={true}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="space-y-3">
                  {/* Name Fields - Register only */}
                  {!isLogin && (
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <label className="label py-0 pb-1">
                            <span className="label-text text-xs">
                              First Name
                            </span>
                          </label>
                          <Field name="firstName">
                            {({ field }) => (
                              <input
                                {...field}
                                type="text"
                                placeholder="John"
                                className={`input input-bordered w-full ${
                                  errors.firstName && touched.firstName
                                    ? "input-error"
                                    : ""
                                }`}
                              />
                            )}
                          </Field>
                          {errors.firstName && touched.firstName && (
                            <div className="text-error text-xs mt-1 flex items-center gap-1">
                              <FiAlertCircle className="w-3 h-3" />{" "}
                              {errors.firstName}
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <label className="label py-0 pb-1">
                            <span className="label-text text-xs">
                              Last Name
                            </span>
                          </label>
                          <Field name="lastName">
                            {({ field }) => (
                              <input
                                {...field}
                                type="text"
                                placeholder="Doe"
                                className={`input input-bordered w-full ${
                                  errors.lastName && touched.lastName
                                    ? "input-error"
                                    : ""
                                }`}
                              />
                            )}
                          </Field>
                          {errors.lastName && touched.lastName && (
                            <div className="text-error text-xs mt-1 flex items-center gap-1">
                              <FiAlertCircle className="w-3 h-3" />{" "}
                              {errors.lastName}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Email Field */}
                  <div>
                    <label className="label py-0 pb-1">
                      <span className="label-text text-xs">Email Address</span>
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40 text-sm" />
                      <Field name="email">
                        {({ field }) => (
                          <input
                            {...field}
                            type="email"
                            placeholder="you@example.com"
                            className={`input input-bordered w-full pl-9 ${
                              errors.email && touched.email ? "input-error" : ""
                            }`}
                          />
                        )}
                      </Field>
                    </div>
                    {errors.email && touched.email && (
                      <div className="text-error text-xs mt-1 flex items-center gap-1">
                        <FiAlertCircle className="w-3 h-3" /> {errors.email}
                      </div>
                    )}
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="label py-0 pb-1">
                      <span className="label-text text-xs">Password</span>
                    </label>
                    <PasswordInput
                      password="password"
                      placeholder="Enter your password"
                    />
                    {errors.password && touched.password && (
                      <div className="text-error text-xs mt-1 flex items-center gap-1">
                        <FiAlertCircle className="w-3 h-3" /> {errors.password}
                      </div>
                    )}
                  </div>

                  {/* Confirm Password - Register only */}
                  {!isLogin && (
                    <div>
                      <label className="label py-0 pb-1">
                        <span className="label-text text-xs">
                          Confirm Password
                        </span>
                      </label>
                      <PasswordInput
                        password="confirmPassword"
                        placeholder="Confirm your password"
                      />
                      {errors.confirmPassword && touched.confirmPassword && (
                        <div className="text-error text-xs mt-1 flex items-center gap-1">
                          <FiAlertCircle className="w-3 h-3" />{" "}
                          {errors.confirmPassword}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Forgot Password Link */}
                  {isLogin && (
                    <div className="text-right">
                      <Link
                        to="/auth/forgot-password"
                        className="text-xs text-primary hover:text-primary-focus transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isPending || isSubmitting}
                    className="btn btn-primary w-full mt-3"
                  >
                    {isPending || isSubmitting ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        <span className="ml-2">
                          {isLogin ? "Signing in..." : "Creating account..."}
                        </span>
                      </>
                    ) : (
                      <span>{isLogin ? "Sign In" : "Create Account"}</span>
                    )}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
