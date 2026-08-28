import { Form, Formik } from "formik";
import { FiLock } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";
import ErrorPage from "../../components/common/ErrorPage";
import PasswordInput from "../../components/common/PasswordInput";
import { useResetPasswordMutation } from "../../hooks/auth/useAuthMutation";
import { resetPasswordSchema } from "../../utils/validation";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const resetPasswordMutation = useResetPasswordMutation();

  if (!token) {
    return (
      <ErrorPage
        code="400"
        message="Invalid reset link"
        subMessage="This link is missing its reset token. Request a new password reset link."
        fullPage
      />
    );
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-base-200 px-4 py-8">
      <section className="card w-full max-w-sm bg-base-100 shadow-xl">
        <div className="card-body gap-5 p-5 sm:p-8">
          <header className="space-y-2 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <FiLock aria-hidden="true" size={22} />
            </div>
            <h1 className="text-2xl font-bold">Reset password</h1>
            <p className="text-sm text-base-content/60">
              Choose a strong new password for your account.
            </p>
          </header>

          <Formik
            initialValues={{ newPassword: "", confirmPassword: "" }}
            validationSchema={resetPasswordSchema}
            onSubmit={(values, { resetForm }) =>
              resetPasswordMutation.mutate(
                { token, ...values },
                { onSuccess: () => resetForm() },
              )
            }
          >
            <Form className="space-y-4" noValidate>
              <PasswordInput name="newPassword" label="New password" placeholder="Enter a new password" autoComplete="new-password" />
              <PasswordInput name="confirmPassword" label="Confirm new password" placeholder="Enter the new password again" autoComplete="new-password" />

              <button type="submit" disabled={resetPasswordMutation.isPending} className="btn btn-primary min-h-11 w-full">
                {resetPasswordMutation.isPending && <span className="loading loading-spinner loading-sm" />}
                {resetPasswordMutation.isPending ? "Resetting..." : "Reset password"}
              </button>
            </Form>
          </Formik>
        </div>
      </section>
    </main>
  );
};

export default ResetPasswordPage;
