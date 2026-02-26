import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import { loginSchema, registerSchema } from "../../utils/validation";
import PasswordInput from "../../components/common/PasswordInput";
import { useLoginMutation } from "../../hooks/auth/useAuthMutation";
import { toast } from "react-toastify";

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const loginMutation = useLoginMutation();

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const handleSubmit = (values, { resetForm }) => {
    if (isLogin) {
      const { email, password } = values;
      loginMutation.mutate(
        { email, password },
        {
          onSuccess: () => {
            resetForm();
          },
        },
      );
    } else {
      console.log("Register data:", values);
    }
  };

  // Reset form fields when toggling between login/register
  const handleToggle = (resetForm) => {
    resetForm();
    setIsLogin((prev) => !prev);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
      <div className="card w-full max-w-sm shadow-2xl bg-base-200 rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-3xl font-bold text-center mb-6">
            {isLogin ? "Login" : "Register"}
          </h2>

          <Formik
            initialValues={initialValues}
            validationSchema={isLogin ? loginSchema : registerSchema}
            onSubmit={handleSubmit}
          >
            {({ resetForm }) => (
              <Form className="space-y-4">
                {!isLogin && (
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Field
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        className="input input-bordered w-full focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
                      />
                      <ErrorMessage
                        name="firstName"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                    <div className="flex-1">
                      <Field
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        className="input input-bordered w-full focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
                      />
                      <ErrorMessage
                        name="lastName"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="input input-bordered w-full focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <PasswordInput password="password" placeholder="Password" />

                {!isLogin && (
                  <PasswordInput
                    password="confirmPassword"
                    placeholder="Confirm Password"
                  />
                )}

                <button
                  type="submit"
                  className="btn btn-primary w-full mt-2 hover:scale-105 transition-transform duration-200"
                  disabled={loginMutation.isPending}
                >
                  {/* ✅ Fixed: shows correct label based on mode + loading state */}
                  {loginMutation.isPending
                    ? isLogin
                      ? "Logging in..."
                      : "Registering..."
                    : isLogin
                      ? "Login"
                      : "Register"}
                </button>

                <p className="text-center mt-4 text-sm text-gray-500">
                  {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}{" "}
                  <span
                    className="text-blue-500 font-semibold cursor-pointer hover:underline"
                    // ✅ Fixed: resets form fields on toggle so stale values don't carry over
                    onClick={() => handleToggle(resetForm)}
                  >
                    {isLogin ? "Register" : "Login"}
                  </span>
                </p>

                <p className="text-center text-sm text-gray-500">
                  Not remember your password?{" "}
                  <span
                    className="text-blue-500 font-semibold cursor-pointer hover:underline"
                    onClick={() => navigate("/forgot-password")}
                  >
                    Forgot Password
                  </span>
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
