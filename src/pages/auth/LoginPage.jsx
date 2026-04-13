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
import { motion, AnimatePresence } from "framer-motion";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [activeField, setActiveField] = useState(null);
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

  // Clear form when toggling between login/register
  useEffect(() => {
    if (formikRef.current) {
      formikRef.current.resetForm();
    }
  }, [isLogin]);

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
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
              toast.error(error?.response?.data?.message || "Login failed");
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
            toast.error(
              error?.response?.data?.message || "Registration failed",
            );
          },
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isPending = loginMutation.isPending || registerMutation.isPending;

  // Input focus styling helper
  const getInputClassName = (fieldName) => {
    const baseClass = "input input-bordered w-full transition-all duration-200";
    const focusClass =
      activeField === fieldName ? "ring-2 ring-primary ring-offset-1" : "";
    return `${baseClass} ${focusClass}`;
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-base-200 to-base-100 flex flex-col lg:flex-row">
      {/* Mobile Banner - Simplified */}
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
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-md space-y-8">
          {/* Logo */}
          <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
            <FiUser className="w-8 h-8" />
          </div>

          {/* Hero Text */}
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

          {/* Feature List */}
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

          {/* Stats */}
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

      {/* RIGHT SIDE - Form Section - Fixed height, no scroll */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
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
                    aria-pressed={isActive}
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
                  <AnimatePresence mode="wait">
                    {!isLogin && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-3 overflow-hidden"
                      >
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
                                  onFocus={() => setActiveField("firstName")}
                                  onBlur={() => setActiveField(null)}
                                  className={`${getInputClassName(
                                    "firstName",
                                  )} ${
                                    errors.firstName && touched.firstName
                                      ? "input-error"
                                      : ""
                                  }`}
                                />
                              )}
                            </Field>
                            <ErrorMessage
                              name="firstName"
                              component="div"
                              className="text-error text-xs mt-1 flex items-center gap-1"
                            >
                              {(msg) => (
                                <>
                                  <FiAlertCircle className="w-3 h-3" /> {msg}
                                </>
                              )}
                            </ErrorMessage>
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
                                  onFocus={() => setActiveField("lastName")}
                                  onBlur={() => setActiveField(null)}
                                  className={`${getInputClassName("lastName")} ${
                                    errors.lastName && touched.lastName
                                      ? "input-error"
                                      : ""
                                  }`}
                                />
                              )}
                            </Field>
                            <ErrorMessage
                              name="lastName"
                              component="div"
                              className="text-error text-xs mt-1 flex items-center gap-1"
                            >
                              {(msg) => (
                                <>
                                  <FiAlertCircle className="w-3 h-3" /> {msg}
                                </>
                              )}
                            </ErrorMessage>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

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
                            onFocus={() => setActiveField("email")}
                            onBlur={() => setActiveField(null)}
                            className={`${getInputClassName("email")} pl-9 ${
                              errors.email && touched.email ? "input-error" : ""
                            }`}
                          />
                        )}
                      </Field>
                    </div>
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-error text-xs mt-1 flex items-center gap-1"
                    >
                      {(msg) => (
                        <>
                          <FiAlertCircle className="w-3 h-3" /> {msg}
                        </>
                      )}
                    </ErrorMessage>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="label py-0 pb-1">
                      <span className="label-text text-xs">Password</span>
                    </label>
                    <PasswordInput
                      password="password"
                      placeholder="Enter your password"
                      onFocus={() => setActiveField("password")}
                      onBlur={() => setActiveField(null)}
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-error text-xs mt-1 flex items-center gap-1"
                    >
                      {(msg) => (
                        <>
                          <FiAlertCircle className="w-3 h-3" /> {msg}
                        </>
                      )}
                    </ErrorMessage>
                  </div>

                  {/* Confirm Password - Register only */}
                  <AnimatePresence mode="wait">
                    {!isLogin && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <label className="label py-0 pb-1">
                          <span className="label-text text-xs">
                            Confirm Password
                          </span>
                        </label>
                        <PasswordInput
                          password="confirmPassword"
                          placeholder="Confirm your password"
                          onFocus={() => setActiveField("confirmPassword")}
                          onBlur={() => setActiveField(null)}
                        />
                        <ErrorMessage
                          name="confirmPassword"
                          component="div"
                          className="text-error text-xs mt-1 flex items-center gap-1"
                        >
                          {(msg) => (
                            <>
                              <FiAlertCircle className="w-3 h-3" /> {msg}
                            </>
                          )}
                        </ErrorMessage>
                      </motion.div>
                    )}
                  </AnimatePresence>

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

            {/* Divider */}
            <div className="divider text-xs text-base-content/40 my-5">OR</div>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-base-content/40 mt-5">
            By continuing, you agree to our{" "}
            <Link to="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
