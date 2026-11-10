<<<<<<< HEAD
import { ErrorMessage, Field, Form, Formik } from "formik";
import { FiArrowLeft, FiMail } from "react-icons/fi";
import { Link } from "react-router-dom";
=======
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link } from "react-router-dom";
import { FiMail, FiArrowLeft } from "react-icons/fi";
import { forgotPasswordSchema } from "../../utils/validation";
import { motion as Motion } from "framer-motion";
>>>>>>> a489968 (fix: update frontend code overall and remove bugs)
import { useForgotPasswordMutation } from "../../hooks/auth/useAuthMutation";
import { ROUTES } from "../../utils/constants";
import { forgotPasswordSchema } from "../../utils/validation";

const ForgotPasswordPage = () => {
  const forgotPasswordMutation = useForgotPasswordMutation();

  return (
<<<<<<< HEAD
    <main className="flex min-h-dvh items-center justify-center bg-base-200 px-4 py-8">
      <section className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body gap-5 p-5 sm:p-8">
          <header className="space-y-2 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <FiMail aria-hidden="true" size={22} />
=======
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Motion.div
          className="card bg-base-100 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="card-body gap-5">
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <FiMail size={22} className="text-primary" />
              </div>

              <h1 className="text-2xl font-bold">Forgot password?</h1>

              <p className="text-sm text-base-content/60">
                No worries. Enter your email and we'll send you a reset link.
              </p>
>>>>>>> a489968 (fix: update frontend code overall and remove bugs)
            </div>
            <h1 className="text-2xl font-bold">Forgot your password?</h1>
            <p className="text-sm text-base-content/60">
              Enter your account email and we will send you a reset link.
            </p>
          </header>

<<<<<<< HEAD
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
=======
            <Formik
              initialValues={{ email: "" }}
              validationSchema={forgotPasswordSchema}
              onSubmit={handleSubmit}
            >
              {() => (
                <Form className="space-y-4">
                  <div>
                    <label className="label pb-1">
                      <span className="label-text font-medium">Email</span>
                    </label>
>>>>>>> a489968 (fix: update frontend code overall and remove bugs)

                <button type="submit" disabled={forgotPasswordMutation.isPending} className="btn btn-primary min-h-11 w-full">
                  {forgotPasswordMutation.isPending && <span className="loading loading-spinner loading-sm" />}
                  {forgotPasswordMutation.isPending ? "Sending..." : "Send reset link"}
                </button>

<<<<<<< HEAD
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
=======
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-error text-xs mt-1"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={forgotPasswordMutation.isPending}
                    className="btn btn-primary w-full"
                  >
                    {forgotPasswordMutation.isPending ? (
                      <>
                        <span className="loading loading-spinner loading-sm" />
                        Sending...
                      </>
                    ) : (
                      "Send reset link"
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <Link
                      to="/auth/login"
                      className="inline-flex items-center gap-2 text-sm text-base-content/60 hover:text-primary transition-colors"
                    >
                      <FiArrowLeft size={14} />
                      Back to login
                    </Link>
                  </div>
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

export default ForgotPasswordPage;
