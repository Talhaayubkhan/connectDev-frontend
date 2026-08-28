import { ErrorMessage, Field, Form, Formik } from "formik";
import { FiArrowLeft, FiMail } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useForgotPasswordMutation } from "../../hooks/auth/useAuthMutation";
import { ROUTES } from "../../utils/constants";
import { forgotPasswordSchema } from "../../utils/validation";

const ForgotPasswordPage = () => {
  const forgotPasswordMutation = useForgotPasswordMutation();

  return (
    <main className="flex min-h-dvh items-center justify-center bg-base-200 px-4 py-8">
      <section className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body gap-5 p-5 sm:p-8">
          <header className="space-y-2 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <FiMail aria-hidden="true" size={22} />
            </div>
            <h1 className="text-2xl font-bold">Forgot your password?</h1>
            <p className="text-sm text-base-content/60">
              Enter your account email and we will send you a reset link.
            </p>
          </header>

          <Formik
            initialValues={{ email: "" }}
            validationSchema={forgotPasswordSchema}
            onSubmit={(values, { resetForm }) =>
              forgotPasswordMutation.mutate(values, {
                onSuccess: () => resetForm(),
              })
            }
          >
            {({ errors, touched }) => (
              <Form className="space-y-4" noValidate>
                <div className="flex flex-col gap-1">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email address
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    autoFocus
                    placeholder="you@example.com"
                    aria-invalid={touched.email && Boolean(errors.email)}
                    aria-describedby={touched.email && errors.email ? "email-error" : undefined}
                    className={`input input-bordered w-full ${touched.email && errors.email ? "input-error" : ""}`}
                  />
                  <ErrorMessage name="email">
                    {(message) => <p id="email-error" className="text-xs text-error">{message}</p>}
                  </ErrorMessage>
                </div>

                <button type="submit" disabled={forgotPasswordMutation.isPending} className="btn btn-primary min-h-11 w-full">
                  {forgotPasswordMutation.isPending && <span className="loading loading-spinner loading-sm" />}
                  {forgotPasswordMutation.isPending ? "Sending..." : "Send reset link"}
                </button>

                <Link to={ROUTES.LOGIN} className="btn btn-ghost min-h-11 w-full gap-2">
                  <FiArrowLeft aria-hidden="true" />
                  Back to login
                </Link>
              </Form>
            )}
          </Formik>
        </div>
      </section>
    </main>
  );
};

export default ForgotPasswordPage;
