<<<<<<< HEAD
import { Form, Formik } from "formik";
import { FiLock } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";
=======
import { useSearchParams } from "react-router-dom";
import { Formik, Form } from "formik";
import { motion as Motion } from "framer-motion";
import PasswordInput from "../../components/common/PasswordInput";
>>>>>>> a489968 (fix: update frontend code overall and remove bugs)
import ErrorPage from "../../components/common/ErrorPage";
import PasswordInput from "../../components/common/PasswordInput";
import { useResetPasswordMutation } from "../../hooks/auth/useAuthMutation";
import { resetPasswordSchema } from "../../utils/validation";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const resetPasswordMutation = useResetPasswordMutation();

<<<<<<< HEAD
=======
  const initialValues = {
    newPassword: "",
    confirmPassword: "",
  };

  const handleSubmit = (values, { resetForm }) => {
    const { newPassword } = values;
    resetPasswordMutation.mutate(
      { token, newPassword },
      { onSuccess: () => resetForm() },
    );
  };

>>>>>>> a489968 (fix: update frontend code overall and remove bugs)
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
<<<<<<< HEAD
    <main className="flex min-h-dvh items-center justify-center bg-base-200 px-4 py-8">
      <section className="card w-full max-w-sm bg-base-100 shadow-xl">
        <div className="card-body gap-5 p-5 sm:p-8">
          <header className="space-y-2 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <FiLock aria-hidden="true" size={22} />
=======
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Motion.div
          className="card bg-base-100 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="card-body gap-5">
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <span className="text-xl">🔒</span>
              </div>

              <h1 className="text-2xl font-bold">Reset password</h1>

              <p className="text-sm text-base-content/60">
                Enter your new password below.
              </p>
>>>>>>> a489968 (fix: update frontend code overall and remove bugs)
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

<<<<<<< HEAD
              <button type="submit" disabled={resetPasswordMutation.isPending} className="btn btn-primary min-h-11 w-full">
                {resetPasswordMutation.isPending && <span className="loading loading-spinner loading-sm" />}
                {resetPasswordMutation.isPending ? "Resetting..." : "Reset password"}
              </button>
            </Form>
          </Formik>
        </div>
      </section>
    </main>
=======
                  <button
                    type="submit"
                    disabled={resetPasswordMutation.isPending}
                    className="btn btn-primary w-full mt-2"
                  >
                    {resetPasswordMutation.isPending ? (
                      <>
                        <span className="loading loading-spinner loading-sm" />
                        Resetting...
                      </>
                    ) : (
                      "Reset password"
                    )}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </Motion.div>
      </div>
    </div>
>>>>>>> a489968 (fix: update frontend code overall and remove bugs)
  );
};

export default ResetPasswordPage;
