import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";

const ForgotPasswordPage = () => {
  const initialValues = { email: "" };

  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Send reset email:", values);

    setTimeout(() => {
      setSubmitting(false);
      alert("Password reset link sent to email");
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
      <div className="card w-full max-w-sm shadow-2xl bg-base-200 rounded-lg overflow-hidden p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>

        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <Field
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="input input-bordered w-full"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
