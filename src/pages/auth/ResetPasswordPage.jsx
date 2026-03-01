import { useSearchParams } from "react-router-dom";
import { Formik, Form } from "formik";
import PasswordInput from "../../components/common/PasswordInput";
import ErrorPage from "../../components/common/ErrorPage";
import { useResetPasswordMutation } from "../../hooks/auth/useAuthMutation";
import { resetPasswordSchema } from "../../utils/validation";

const ResetPasswordPage = () => {
  // Read token from URL
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const resetPasswordMutation = useResetPasswordMutation();

  const initialValues = {
    newPassword: "",
    confirmPassword: "",
  };

  const handleSubmit = (values) => {
    resetPasswordMutation.mutate({ token });
    console.log("Reset password data:", {
      token,
      ...values,
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
      <div className="card w-full max-w-sm shadow-2xl bg-base-200 rounded-lg overflow-hidden p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>

        {!token ? (
          <ErrorPage code="400" message="Invalid Reset Link" />
        ) : (
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={resetPasswordSchema}
          >
            {() => (
              <Form className="space-y-4">
                <PasswordInput name="password" placeholder="New Password" />

                <PasswordInput
                  name="confirmPassword"
                  placeholder="Confirm Password"
                />

                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={resetPasswordMutation.isPending}
                >
                  {resetPasswordMutation.isPending && (
                    <span className="loading loading-spinner loading-sm" />
                  )}
                  :{" "}
                  {resetPasswordMutation.isPending
                    ? "Resetting..."
                    : "Reset Password"}
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
