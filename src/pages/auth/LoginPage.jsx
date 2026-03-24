// import { useState } from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import { Link } from "react-router-dom";
// import { loginSchema, registerSchema } from "../../utils/validation";
// import PasswordInput from "../../components/common/PasswordInput";
// import {
//   useLoginMutation,
//   useSignupMutation,
// } from "../../hooks/auth/useAuthMutation";
// import { toast } from "react-toastify";
// import { FiUser, FiMail } from "react-icons/fi";

// const LoginPage = () => {
//   const [isLogin, setIsLogin] = useState(true);
//   const loginMutation = useLoginMutation();
//   const registerMutation = useSignupMutation();

//   const initialValues = {
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   };

//   const handleSubmit = (values, { resetForm }) => {
//     if (isLogin) {
//       loginMutation.mutate(
//         { email: values.email, password: values.password },
//         { onSuccess: () => resetForm() },
//       );
//     } else {
//       registerMutation.mutate(values, {
//         onSuccess: () => {
//           toast.success("Account created! Please sign in.");
//           resetForm();
//           setIsLogin(true);
//         },
//       });
//     }
//   };

//   const isPending = loginMutation.isPending || registerMutation.isPending;

//   return (
//     <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         {/* Card */}
//         <div className="card bg-base-100 shadow-xl">
//           <div className="card-body gap-5">
//             {/* Tab toggle */}
//             <div role="tablist" className="tabs tabs-boxed bg-base-200">
//               <button
//                 role="tab"
//                 className={`tab flex-1 transition-all ${isLogin ? "tab-active" : ""}`}
//                 onClick={() => setIsLogin(true)}
//               >
//                 Login
//               </button>
//               <button
//                 role="tab"
//                 className={`tab flex-1 transition-all ${!isLogin ? "tab-active" : ""}`}
//                 onClick={() => setIsLogin(false)}
//               >
//                 Register
//               </button>
//             </div>

//             <Formik
//               initialValues={initialValues}
//               validationSchema={isLogin ? loginSchema : registerSchema}
//               onSubmit={handleSubmit}
//               enableReinitialize
//             >
//               {() => (
//                 <Form className="flex flex-col gap-4">
//                   {/* Name fields — register only */}
//                   {!isLogin && (
//                     <div className="flex gap-3">
//                       <div className="flex-1">
//                         <label className="label">
//                           <span className="label-text flex items-center gap-1">
//                             <FiUser size={12} /> First Name
//                           </span>
//                         </label>
//                         <Field
//                           name="firstName"
//                           placeholder="First name"
//                           className="input input-bordered w-full"
//                         />
//                         <ErrorMessage
//                           name="firstName"
//                           component="div"
//                           className="text-error text-xs mt-1"
//                         />
//                       </div>
//                       <div className="flex-1">
//                         <label className="label">
//                           <span className="label-text flex items-center gap-1">
//                             <FiUser size={12} /> Last Name
//                           </span>
//                         </label>
//                         <Field
//                           name="lastName"
//                           placeholder="Last name"
//                           className="input input-bordered w-full"
//                         />
//                         <ErrorMessage
//                           name="lastName"
//                           component="div"
//                           className="text-error text-xs mt-1"
//                         />
//                       </div>
//                     </div>
//                   )}

//                   {/* Email */}
//                   <div>
//                     <label className="label">
//                       <span className="label-text flex items-center gap-1">
//                         <FiMail size={12} /> Email
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

//                   {/* Password */}
//                   <PasswordInput
//                     password="password"
//                     placeholder="Password"
//                     label="Password"
//                   />

//                   {/* Confirm password — register only */}
//                   {!isLogin && (
//                     <PasswordInput
//                       password="confirmPassword"
//                       placeholder="Confirm password"
//                       label="Confirm Password"
//                     />
//                   )}

//                   {/* Forgot password — login only */}
//                   {isLogin && (
//                     <div className="text-right -mt-2">
//                       <Link
//                         to="/auth/forgot-password"
//                         className="text-xs text-primary hover:underline"
//                       >
//                         Forgot password?
//                       </Link>
//                     </div>
//                   )}

//                   {/* Submit */}
//                   <button
//                     type="submit"
//                     className="btn btn-primary w-full mt-1"
//                     disabled={isPending}
//                   >
//                     {isPending ? (
//                       <span className="loading loading-spinner loading-sm" />
//                     ) : isLogin ? (
//                       "Sign In"
//                     ) : (
//                       "Create Account"
//                     )}
//                   </button>
//                 </Form>
//               )}
//             </Formik>
//           </div>
//         </div>

//         {/* Footer note */}
//         <p className="text-center text-xs text-base-content/40 mt-6">
//           By continuing you agree to our Terms of Service.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link } from "react-router-dom";
import { loginSchema, registerSchema } from "../../utils/validation";
import PasswordInput from "../../components/common/PasswordInput";
import {
  useLoginMutation,
  useSignupMutation,
} from "../../hooks/auth/useAuthMutation";
import { toast } from "react-toastify";
import { FiUser, FiMail } from "react-icons/fi";
import { motion } from "framer-motion";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const loginMutation = useLoginMutation();
  const registerMutation = useSignupMutation();

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const handleSubmit = (values, { resetForm }) => {
    if (isLogin) {
      loginMutation.mutate(
        { email: values.email, password: values.password },
        { onSuccess: () => resetForm() },
      );
    } else {
      registerMutation.mutate(values, {
        onSuccess: () => {
          toast.success("Account created! Please sign in.");
          resetForm();
          setIsLogin(true);
        },
      });
    }
  };

  const isPending = loginMutation.isPending || registerMutation.isPending;

  return (
    <div className="min-h-screen bg-base-200 flex flex-col lg:flex-row">
      {/* MOBILE TOP BANNER */}
      <div className="lg:hidden w-full bg-gradient-to-r from-primary to-secondary text-white p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/20">
            <FiUser className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-semibold">Connect. Build. Grow.</h1>
            <p className="text-xs opacity-80">
              Join developers and start building together
            </p>
          </div>
        </div>
      </div>

      {/* LEFT SIDE (DESKTOP) */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-primary to-secondary text-white px-10 xl:px-16 py-12 items-center">
        {/* Background blur */}
        <div className="absolute w-72 h-72 bg-white/10 rounded-full blur-3xl top-10 left-10" />
        <div className="absolute w-72 h-72 bg-white/10 rounded-full blur-3xl bottom-10 right-10" />

        <div className="relative z-10 max-w-md space-y-6">
          <div className="w-20 h-20 flex items-center justify-center rounded-2xl bg-white/20">
            <FiUser className="w-10 h-10" />
          </div>

          <h1 className="text-4xl xl:text-4xl font-bold leading-tight">
            Connect. Build. Grow.
          </h1>

          <p className="text-sm xl:text-base opacity-90 leading-relaxed">
            A space where developers meet, collaborate, and build meaningful
            connections.
          </p>

          <ul className="space-y-2 text-md opacity-90">
            <li>• Find like-minded developers</li>
            <li>• Chat and collaborate instantly</li>
            <li>• Build real-world connections</li>
          </ul>
        </div>
      </div>

      {/* RIGHT SIDE (FORM) */}
      <div className="flex flex-1 items-center justify-center px-4 sm:px-6 md:px-8 py-6 sm:py-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm sm:max-w-md"
        >
          <div className="bg-base-100 rounded-xl sm:rounded-2xl shadow-lg p-5 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
            {/* Heading */}
            <div className="text-center space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold">
                {isLogin ? "Welcome back" : "Create account"}
              </h2>
              <p className="text-xs sm:text-sm text-base-content/50">
                {isLogin ? "Sign in to continue" : "Join and start connecting"}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex bg-base-200 rounded-lg p-1">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 text-xs sm:text-sm rounded-md transition ${
                  isLogin
                    ? "bg-base-100 shadow font-medium"
                    : "text-base-content/60"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 text-xs sm:text-sm rounded-md transition ${
                  !isLogin
                    ? "bg-base-100 shadow font-medium"
                    : "text-base-content/60"
                }`}
              >
                Register
              </button>
            </div>

            <Formik
              initialValues={initialValues}
              validationSchema={isLogin ? loginSchema : registerSchema}
              onSubmit={handleSubmit}
            >
              {() => (
                <Form className="space-y-4">
                  {/* Name fields */}
                  {!isLogin && (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <Field
                          name="firstName"
                          placeholder="First name"
                          className="input input-bordered w-full"
                        />
                        <ErrorMessage
                          name="firstName"
                          component="div"
                          className="text-error text-xs mt-1"
                        />
                      </div>

                      <div className="flex-1">
                        <Field
                          name="lastName"
                          placeholder="Last name"
                          className="input input-bordered w-full"
                        />
                        <ErrorMessage
                          name="lastName"
                          component="div"
                          className="text-error text-xs mt-1"
                        />
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  <div className="relative">
                    <FiMail className="absolute left-3 top-3 text-base-content/40" />
                    <Field
                      type="email"
                      name="email"
                      placeholder="Email address"
                      className="input input-bordered w-full pl-9"
                    />
                  </div>
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-error text-xs mt-1"
                  />

                  {/* Password */}
                  <PasswordInput password="password" placeholder="Password" />

                  {!isLogin && (
                    <PasswordInput
                      password="confirmPassword"
                      placeholder="Confirm password"
                    />
                  )}

                  {/* Forgot */}
                  {isLogin && (
                    <div className="text-right">
                      <Link
                        to="/auth/forgot-password"
                        className="text-xs text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  )}

                  {/* Button */}
                  <button
                    type="submit"
                    disabled={isPending}
                    className="btn btn-primary w-full"
                  >
                    {isPending ? (
                      <span className="loading loading-spinner loading-sm" />
                    ) : isLogin ? (
                      "Sign In"
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </Form>
              )}
            </Formik>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-base-content/40 mt-4 sm:mt-6">
            By continuing you agree to our Terms
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
