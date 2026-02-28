import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link } from "react-router-dom";
import { FiMail, FiArrowLeft } from "react-icons/fi";
import { HiCode } from "react-icons/hi";
import * as Yup from "yup";

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

const ForgotPasswordPage = () => {
  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    console.log("Send reset email:", values);
    setTimeout(() => {
      setSubmitting(false);
      resetForm();
      // replace with actual mutation when API is ready
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body gap-5">
            {/* Icon + heading */}
            <div className="flex flex-col items-center text-center gap-2">
              <div className="bg-primary/10 p-4 rounded-full">
                <FiMail size={28} className="text-primary" />
              </div>
              <h2 className="text-xl font-bold">Forgot Password?</h2>
              <p className="text-sm text-base-content/50">
                Enter your email and we'll send you a reset link.
              </p>
            </div>

            <div className="divider my-0" />

            <Formik
              initialValues={{ email: "" }}
              validationSchema={forgotPasswordSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="flex flex-col gap-4">
                  <div>
                    <label className="label">
                      <span className="label-text flex items-center gap-1">
                        <FiMail size={12} /> Email Address
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

                  <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="loading loading-spinner loading-sm" />
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>

                  {/* Back to login */}
                  <Link
                    to="/login"
                    className="btn btn-ghost btn-sm w-full flex items-center gap-2"
                  >
                    <FiArrowLeft size={14} /> Back to Login
                  </Link>
                </Form>
              )}
            </Formik>
          </div>
        </div>

        <p className="text-center text-xs text-base-content/40 mt-6">
          Remember your password?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
