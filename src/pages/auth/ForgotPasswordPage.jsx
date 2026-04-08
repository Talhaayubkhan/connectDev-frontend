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
//     forgotPasswordMutation.mutate(
//       { email: values.email },
//       { onSuccess: () => resetForm() },
//     );
//   };

//   return (
//     <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-6">
//       <div className="w-full max-w-md">
//         <Motion.div
//           className="card bg-base-100 shadow-xl border border-base-200"
//           initial={{ opacity: 0, y: 32 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.4 }}
//         >
//           {/* Top Accent */}
//           <div className="h-1.5 w-full bg-gradient-to-r from-primary to-secondary" />

//           <div className="card-body gap-6">
//             {/* Header */}
//             <div className="flex flex-col items-center text-center gap-2">
//               <div className="bg-primary/10 p-4 rounded-full">
//                 <FiMail size={26} className="text-primary" />
//               </div>

//               <h2 className="text-xl font-bold">Forgot Password</h2>

//               <p className="text-sm text-base-content/60 max-w-xs">
//                 Enter your email and we’ll send you a secure reset link.
//               </p>
//             </div>

//             <Formik
//               initialValues={{ email: "" }}
//               validationSchema={forgotPasswordSchema}
//               onSubmit={handleSubmit}
//             >
//               {() => (
//                 <Form className="flex flex-col gap-4">
//                   {/* Email */}
//                   <div>
//                     <label className="label">
//                       <span className="label-text flex items-center gap-2 text-base-content/70">
//                         <FiMail size={14} /> Email Address
//                       </span>
//                     </label>

//                     <Field
//                       type="email"
//                       name="email"
//                       placeholder="you@example.com"
//                       className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
//                     />

//                     <ErrorMessage
//                       name="email"
//                       component="div"
//                       className="text-error text-xs mt-1"
//                     />
//                   </div>

//                   {/* Submit */}
//                   <Motion.button
//                     type="submit"
//                     disabled={forgotPasswordMutation.isPending}
//                     className="btn btn-primary w-full mt-1 shadow-md hover:shadow-lg transition"
//                     whileTap={{ scale: 0.97 }}
//                   >
//                     {forgotPasswordMutation.isPending ? (
//                       <>
//                         <span className="loading loading-spinner loading-sm" />
//                         Sending...
//                       </>
//                     ) : (
//                       "Send Reset Link"
//                     )}
//                   </Motion.button>

//                   {/* Back */}
//                   <Link
//                     to="/auth/login"
//                     className="btn btn-ghost btn-sm w-full flex items-center justify-center gap-2 text-base-content/70"
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

// import { Formik, Form, Field, ErrorMessage } from "formik";
// import { Link } from "react-router-dom";
// import { FiMail, FiArrowLeft, FiSend, FiCheckCircle } from "react-icons/fi";
// import { forgotPasswordSchema } from "../../utils/validation";
// import { motion } from "framer-motion";
// import { useForgotPasswordMutation } from "../../hooks/auth/useAuthMutation";
// import { useState } from "react";

// const ForgotPasswordPage = () => {
//   const forgotPasswordMutation = useForgotPasswordMutation();
//   const [isEmailSent, setIsEmailSent] = useState(false);

//   const handleSubmit = (values, { resetForm }) => {
//     forgotPasswordMutation.mutate(
//       { email: values.email },
//       {
//         onSuccess: () => {
//           setIsEmailSent(true);
//           resetForm();
//         },
//       },
//     );
//   };

//   if (isEmailSent) {
//     return (
//       <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
//         <div className="w-full max-w-md text-center">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="card bg-base-100 shadow-xl p-8"
//           >
//             <div className="flex justify-center mb-4">
//               <div className="bg-success/10 p-3 rounded-full">
//                 <FiCheckCircle size={40} className="text-success" />
//               </div>
//             </div>
//             <h3 className="text-xl font-bold mb-2">Check Your Email</h3>
//             <p className="text-sm text-base-content/60 mb-4">
//               We've sent a password reset link to your email address.
//             </p>
//             <Link to="/auth/login" className="btn btn-primary btn-sm">
//               Back to Login
//             </Link>
//           </motion.div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-6">
//       <div className="w-full max-w-md">
//         <motion.div
//           className="card bg-base-100 shadow-xl"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.3 }}
//         >
//           <div className="card-body gap-5 p-6">
//             {/* Header */}
//             <div className="text-center space-y-2">
//               <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
//                 <FiMail size={24} className="text-primary" />
//               </div>
//               <h2 className="text-2xl font-bold">Reset Password</h2>
//               <p className="text-sm text-base-content/60">
//                 Enter your email to receive a reset link
//               </p>
//             </div>

//             <Formik
//               initialValues={{ email: "" }}
//               validationSchema={forgotPasswordSchema}
//               onSubmit={handleSubmit}
//             >
//               {({ isValid, dirty }) => (
//                 <Form className="space-y-4">
//                   <div>
//                     <label className="label">
//                       <span className="label-text">Email Address</span>
//                     </label>
//                     <Field
//                       type="email"
//                       name="email"
//                       placeholder="you@example.com"
//                       className="input input-bordered w-full"
//                       autoFocus
//                     />
//                     <ErrorMessage
//                       name="email"
//                       component="div"
//                       className="text-error text-xs mt-1"
//                     />
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={forgotPasswordMutation.isPending || !dirty}
//                     className="btn btn-primary w-full gap-2"
//                   >
//                     {forgotPasswordMutation.isPending ? (
//                       <>
//                         <span className="loading loading-spinner loading-sm" />
//                         Sending...
//                       </>
//                     ) : (
//                       <>
//                         <FiSend size={14} />
//                         Send Reset Link
//                       </>
//                     )}
//                   </button>

//                   <Link
//                     to="/auth/login"
//                     className="btn btn-ghost btn-sm w-full"
//                   >
//                     <FiArrowLeft size={14} className="mr-1" />
//                     Back to Login
//                   </Link>
//                 </Form>
//               )}
//             </Formik>
//           </div>
//         </motion.div>
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

const ForgotPasswordPage = () => {
  const forgotPasswordMutation = useForgotPasswordMutation();

  const handleSubmit = (values, { resetForm }) => {
    forgotPasswordMutation.mutate(
      { email: values.email },
      { onSuccess: () => resetForm() },
    );
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <motion.div
          className="card bg-base-100 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="card-body gap-5">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <FiMail size={22} className="text-primary" />
              </div>

              <h1 className="text-2xl font-bold">Forgot password?</h1>

              <p className="text-sm text-base-content/60">
                No worries. Enter your email and we'll send you a reset link.
              </p>
            </div>

            <Formik
              initialValues={{ email: "" }}
              validationSchema={forgotPasswordSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  {/* Email Field */}
                  <div>
                    <label className="label pb-1">
                      <span className="label-text font-medium">Email</span>
                    </label>

                    <Field
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      className="input input-bordered w-full focus:outline-none focus:border-primary transition-colors"
                      autoComplete="email"
                      autoFocus
                    />

                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-error text-xs mt-1"
                    />
                  </div>

                  {/* Submit Button */}
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

                  {/* Back Link */}
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
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
