import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link } from "react-router-dom";
import { loginSchema, registerSchema } from "../../utils/validation";
import PasswordInput from "../../components/common/PasswordInput";
import {
  useLoginMutation,
  useSignupMutation,
} from "../../hooks/auth/useAuthMutation";
import { toast } from "react-toastify";
import { FiUser, FiMail } from "react-icons/fi";
import { HiCode } from "react-icons/hi";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const loginMutation = useLoginMutation();
  const registerMutation = useSignupMutation();

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const handleSubmit = (values, { resetForm }) => {
    if (isLogin) {
      loginMutation.mutate(
        { email: values.email, password: values.password },
        { onSuccess: () => resetForm() },
      );
    } else {
      registerMutation.mutate(values, {
        onSuccess: () => {
          toast.success("Account created! Please sign in.");
          resetForm();
          setIsLogin(true);
        },
      });
    }
  };

  const isPending = loginMutation.isPending || registerMutation.isPending;

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body gap-5">
            {/* Tab toggle */}
            <div role="tablist" className="tabs tabs-boxed bg-base-200">
              <button
                role="tab"
                className={`tab flex-1 transition-all ${isLogin ? "tab-active" : ""}`}
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>
              <button
                role="tab"
                className={`tab flex-1 transition-all ${!isLogin ? "tab-active" : ""}`}
                onClick={() => setIsLogin(false)}
              >
                Register
              </button>
            </div>

            <Formik
              initialValues={initialValues}
              validationSchema={isLogin ? loginSchema : registerSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {() => (
                <Form className="flex flex-col gap-4">
                  {/* Name fields — register only */}
                  {!isLogin && (
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="label">
                          <span className="label-text flex items-center gap-1">
                            <FiUser size={12} /> First Name
                          </span>
                        </label>
                        <Field
                          name="firstName"
                          placeholder="First name"
                          className="input input-bordered w-full"
                        />
                        <ErrorMessage
                          name="firstName"
                          component="div"
                          className="text-error text-xs mt-1"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="label">
                          <span className="label-text flex items-center gap-1">
                            <FiUser size={12} /> Last Name
                          </span>
                        </label>
                        <Field
                          name="lastName"
                          placeholder="Last name"
                          className="input input-bordered w-full"
                        />
                        <ErrorMessage
                          name="lastName"
                          component="div"
                          className="text-error text-xs mt-1"
                        />
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  <div>
                    <label className="label">
                      <span className="label-text flex items-center gap-1">
                        <FiMail size={12} /> Email
                      </span>
                    </label>
                    <Field
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      className="input input-bordered w-full"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-error text-xs mt-1"
                    />
                  </div>

                  {/* Password */}
                  <PasswordInput
                    password="password"
                    placeholder="Password"
                    label="Password"
                  />

                  {/* Confirm password — register only */}
                  {!isLogin && (
                    <PasswordInput
                      password="confirmPassword"
                      placeholder="Confirm password"
                      label="Confirm Password"
                    />
                  )}

                  {/* Forgot password — login only */}
                  {isLogin && (
                    <div className="text-right -mt-2">
                      <Link
                        to="/forgot-password"
                        className="text-xs text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    className="btn btn-primary w-full mt-1"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <span className="loading loading-spinner loading-sm" />
                    ) : isLogin ? (
                      "Sign In"
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-base-content/40 mt-6">
          By continuing you agree to our Terms of Service.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
