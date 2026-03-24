// import { useSearchParams } from "react-router-dom";
// import { Formik, Form } from "formik";
// import { motion } from "framer-motion";
// import PasswordInput from "../../components/common/PasswordInput";
// import ErrorPage from "../../components/common/ErrorPage";
// import { useResetPasswordMutation } from "../../hooks/auth/useAuthMutation";
// import { resetPasswordSchema } from "../../utils/validation";

// const Motion = motion;

// const ResetPasswordPage = () => {
//   const [searchParams] = useSearchParams();
//   const token = searchParams.get("token");

//   const resetPasswordMutation = useResetPasswordMutation();

//   const initialValues = {
//     newPassword: "",
//     confirmPassword: "",
//   };

//   const handleSubmit = (values, { resetForm }) => {
//     const { newPassword } = values;
//     resetPasswordMutation.mutate(
//       { token, newPassword },
//       { onSuccess: () => resetForm() },
//     );
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-sky-100 p-4">
//       {!token ? (
//         <ErrorPage
//           code="400"
//           message="Invalid Reset Link"
//           subMessage="This reset link is missing a token. Please request a new one."
//         />
//       ) : (
//         <Motion.div
//           className="card w-full max-w-sm shadow-2xl bg-base-100 rounded-2xl overflow-hidden"
//           initial={{ opacity: 0, y: 32 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.4, ease: "easeOut" }}
//         >
//           {/* WHY same accent bar?
//               Consistent visual language across all auth pages. */}
//           <div className="h-1.5 w-full bg-gradient-to-r from-primary to-secondary" />

//           <div className="card-body p-8 gap-0">
//             <div className="flex flex-col items-center mb-6">
//               <div className="avatar placeholder mb-3">
//                 <div className="bg-primary text-primary-content rounded-xl w-12">
//                   <span className="text-xl">🔒</span>
//                 </div>
//               </div>
//               <h2 className="card-title text-2xl font-bold">Reset Password</h2>
//               <p className="text-base-content/50 text-sm mt-1 text-center">
//                 Enter your new password below.
//               </p>
//             </div>

//             <Formik
//               initialValues={initialValues}
//               validationSchema={resetPasswordSchema}
//               onSubmit={handleSubmit}
//             >
//               {() => (
//                 <Form className="flex flex-col gap-3">
//                   {/* WHY password="newPassword"?
//                       PasswordInput uses this as the Formik field name.
//                       Must match initialValues key and resetPasswordSchema field. */}
//                   <PasswordInput
//                     password="newPassword"
//                     placeholder="New Password"
//                   />
//                   <PasswordInput
//                     password="confirmPassword"
//                     placeholder="Confirm Password"
//                   />

//                   <Motion.button
//                     type="submit"
//                     disabled={resetPasswordMutation.isPending}
//                     className="btn btn-primary w-full mt-1"
//                     whileTap={{ scale: 0.97 }}
//                     transition={{ duration: 0.1 }}
//                   >
//                     {resetPasswordMutation.isPending && (
//                       <span className="loading loading-spinner loading-sm" />
//                     )}
//                     {resetPasswordMutation.isPending
//                       ? "Resetting..."
//                       : "Reset Password"}
//                   </Motion.button>
//                 </Form>
//               )}
//             </Formik>
//           </div>
//         </Motion.div>
//       )}
//     </div>
//   );
// };

// export default ResetPasswordPage;

import { useSearchParams, Link } from "react-router-dom";
import { Formik, Form } from "formik";
import { motion } from "framer-motion";
import { FiLock } from "react-icons/fi";
import PasswordInput from "../../components/common/PasswordInput";
import ErrorPage from "../../components/common/ErrorPage";
import { useResetPasswordMutation } from "../../hooks/auth/useAuthMutation";
import { resetPasswordSchema } from "../../utils/validation";

const Motion = motion;

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const resetPasswordMutation = useResetPasswordMutation();

  const handleSubmit = (values, { resetForm }) => {
    const { newPassword, confirmPassword } = values;
    resetPasswordMutation.mutate(
      { token, newPassword, confirmPassword },
      { onSuccess: () => resetForm() },
    );
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
        <ErrorPage
          code="400"
          message="Invalid Reset Link"
          subMessage="This reset link is missing or expired. Please request a new one."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-md">
        <Motion.div
          className="card bg-base-100 shadow-xl border border-base-200"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Accent */}
          <div className="h-1.5 w-full bg-gradient-to-r from-primary to-secondary" />

          <div className="card-body gap-6">
            {/* Header */}
            <div className="flex flex-col items-center text-center gap-2">
              <div className="bg-primary/10 p-4 rounded-full">
                <FiLock size={26} className="text-primary" />
              </div>

              <h2 className="text-xl font-bold">Reset Password</h2>

              <p className="text-sm text-base-content/60 max-w-xs">
                Enter your new password below to secure your account.
              </p>
            </div>

            <Formik
              initialValues={{
                newPassword: "",
                confirmPassword: "",
              }}
              validationSchema={resetPasswordSchema}
              onSubmit={handleSubmit}
            >
              {() => (
                <Form className="flex flex-col gap-4">
                  <PasswordInput
                    password="newPassword"
                    placeholder="New Password"
                  />

                  <PasswordInput
                    password="confirmPassword"
                    placeholder="Confirm Password"
                  />

                  <Motion.button
                    type="submit"
                    disabled={resetPasswordMutation.isPending}
                    className="btn btn-primary w-full shadow-md hover:shadow-lg transition"
                    whileTap={{ scale: 0.97 }}
                  >
                    {resetPasswordMutation.isPending ? (
                      <>
                        <span className="loading loading-spinner loading-sm" />
                        Resetting...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </Motion.button>

                  <Link
                    to="/auth/login"
                    className="btn btn-ghost btn-sm w-full text-base-content/70"
                  >
                    Back to Login
                  </Link>
                </Form>
              )}
            </Formik>
          </div>
        </Motion.div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
