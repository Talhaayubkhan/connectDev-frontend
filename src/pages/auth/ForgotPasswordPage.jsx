// import { Formik, Form, Field, ErrorMessage } from "formik";
// import { Link } from "react-router-dom";
// import { FiMail, FiArrowLeft } from "react-icons/fi";
// import { forgotPasswordSchema } from "../../utils/validation";
// import { motion } from "framer-motion";
// import { useForgotPasswordMutation } from "../../hooks/auth/useAuthMutation";

// const Motion = motion;

// const ForgotPasswordPage = () => {
//   const forgotPasswordMutation = useForgotPasswordMutation();

//   const handleSubmit = (values, { resetForm }) => {
//     const { email } = values;
//     forgotPasswordMutation.mutate({ email }, { onSuccess: () => resetForm() });
//   };

//   return (
//     <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         {/* WHY motion.div on card only?
//             Same entrance animation as LoginPage — consistent across auth pages.
//             y:32 → 0 + fade in. User feels the same "brand" on every auth page. */}
//         <Motion.div
//           className="card bg-base-100 shadow-xl"
//           initial={{ opacity: 0, y: 32 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.4, ease: "easeOut" }}
//         >
//           <div className="card-body gap-5">
//             {/* Icon + heading */}
//             <div className="flex flex-col items-center text-center gap-2">
//               <div className="bg-primary/10 p-4 rounded-full">
//                 <FiMail size={28} className="text-primary" />
//               </div>
//               <h2 className="text-xl font-bold">Forgot Password?</h2>
//               <p className="text-sm text-base-content/50">
//                 Enter your email and we'll send you a reset link.
//               </p>
//             </div>

//             <div className="divider my-0" />

//             <Formik
//               initialValues={{ email: "" }}
//               validationSchema={forgotPasswordSchema}
//               onSubmit={handleSubmit}
//             >
//               {() => (
//                 <Form className="flex flex-col gap-4">
//                   <div>
//                     <label className="label">
//                       <span className="label-text flex items-center gap-1">
//                         <FiMail size={12} /> Email Address
//                       </span>
//                     </label>
//                     <Field
//                       type="email"
//                       name="email"
//                       placeholder="you@example.com"
//                       className="input input-bordered w-full"
//                     />
//                     <ErrorMessage
//                       name="email"
//                       component="div"
//                       className="text-error text-xs mt-1"
//                     />
//                   </div>
//                   <Motion.button
//                     type="submit"
//                     disabled={forgotPasswordMutation.isPending}
//                     className="btn btn-primary w-full mt-1"
//                     whileTap={{ scale: 0.97 }}
//                     transition={{ duration: 0.1 }}
//                   >
//                     {forgotPasswordMutation.isPending && (
//                       <span className="loading loading-spinner loading-sm" />
//                     )}
//                     {forgotPasswordMutation.isPending
//                       ? "Sending..."
//                       : "Send Reset Link"}
//                   </Motion.button>
//                   <Link
//                     to="/auth/login"
//                     className="btn btn-ghost btn-sm w-full flex items-center gap-2"
//                   >
//                     <FiArrowLeft size={14} /> Back to Login
//                   </Link>
//                 </Form>
//               )}
//             </Formik>
//           </div>
//         </Motion.div>
//       </div>
//     </div>
//   );
// };

// export default ForgotPasswordPage;

import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link } from "react-router-dom";
import { FiMail, FiArrowLeft } from "react-icons/fi";
import { forgotPasswordSchema } from "../../utils/validation";
import { motion } from "framer-motion";
import { useForgotPasswordMutation } from "../../hooks/auth/useAuthMutation";

const Motion = motion;

const ForgotPasswordPage = () => {
  const forgotPasswordMutation = useForgotPasswordMutation();

  const handleSubmit = (values, { resetForm }) => {
    forgotPasswordMutation.mutate(
      { email: values.email },
      { onSuccess: () => resetForm() },
    );
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-md">
        <Motion.div
          className="card bg-base-100 shadow-xl border border-base-200"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Top Accent */}
          <div className="h-1.5 w-full bg-gradient-to-r from-primary to-secondary" />

          <div className="card-body gap-6">
            {/* Header */}
            <div className="flex flex-col items-center text-center gap-2">
              <div className="bg-primary/10 p-4 rounded-full">
                <FiMail size={26} className="text-primary" />
              </div>

              <h2 className="text-xl font-bold">Forgot Password</h2>

              <p className="text-sm text-base-content/60 max-w-xs">
                Enter your email and we’ll send you a secure reset link.
              </p>
            </div>

            <Formik
              initialValues={{ email: "" }}
              validationSchema={forgotPasswordSchema}
              onSubmit={handleSubmit}
            >
              {() => (
                <Form className="flex flex-col gap-4">
                  {/* Email */}
                  <div>
                    <label className="label">
                      <span className="label-text flex items-center gap-2 text-base-content/70">
                        <FiMail size={14} /> Email Address
                      </span>
                    </label>

                    <Field
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                    />

                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-error text-xs mt-1"
                    />
                  </div>

                  {/* Submit */}
                  <Motion.button
                    type="submit"
                    disabled={forgotPasswordMutation.isPending}
                    className="btn btn-primary w-full mt-1 shadow-md hover:shadow-lg transition"
                    whileTap={{ scale: 0.97 }}
                  >
                    {forgotPasswordMutation.isPending ? (
                      <>
                        <span className="loading loading-spinner loading-sm" />
                        Sending...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Motion.button>

                  {/* Back */}
                  <Link
                    to="/auth/login"
                    className="btn btn-ghost btn-sm w-full flex items-center justify-center gap-2 text-base-content/70"
                  >
                    <FiArrowLeft size={14} /> Back to Login
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

export default ForgotPasswordPage;
