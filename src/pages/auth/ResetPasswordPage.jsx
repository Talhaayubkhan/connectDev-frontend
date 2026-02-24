import { useSearchParams } from "react-router-dom";
import { Formik, Form } from "formik";
import PasswordInput from "../../components/common/PasswordInput";
import ErrorPage from "../../components/common/ErrorPage";

const ResetPasswordPage = () => {
  // Read token from URL
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const initialValues = {
    password: "",
    confirmPassword: "",
  };

  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Reset password data:", {
      token,
      ...values,
    });

    setTimeout(() => setSubmitting(false), 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
      <div className="card w-full max-w-sm shadow-2xl bg-base-200 rounded-lg overflow-hidden p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>

        {!token ? (
          <ErrorPage code="400" message="Invalid Reset Link" />
        ) : (
          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <PasswordInput name="password" placeholder="New Password" />

                <PasswordInput
                  name="confirmPassword"
                  placeholder="Confirm Password"
                />

                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Resetting..." : "Reset Password"}
                </button>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
