// import { Formik, Form } from "formik";
// import { FiLock, FiX } from "react-icons/fi";
// import { motion } from "framer-motion";
// import { confirmPasswordSchema } from "../../utils/validation";
// import PasswordInput from "../../components/common/PasswordInput";
// import { useChangePasswordMutation } from "../../hooks/auth/useAuthMutation";
// import { toast } from "react-toastify";

// const Motion = motion;

// const ProfilePasswordChange = ({ isOpen, onClose }) => {
//   const passwordMutation = useChangePasswordMutation();

//   const initialValues = {
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   };

//   const handleConfirmPassword = (values) => {
//     const { currentPassword, newPassword } = values;
//     passwordMutation.mutate({ currentPassword, newPassword });
//   };

//   if (!isOpen) return null;

//   return (
//     <Motion.div
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       transition={{ duration: 0.2 }}
//       onClick={onClose}
//     >
//       <Motion.div
//         className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-5"
//         initial={{ opacity: 0, scale: 0.95, y: 16 }}
//         animate={{ opacity: 1, scale: 1, y: 0 }}
//         exit={{ opacity: 0, scale: 0.95, y: 16 }}
//         transition={{ duration: 0.25, ease: "easeOut" }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex items-center justify-between">
//           <h2 className="text-xl font-bold flex items-center gap-2">
//             <FiLock size={18} /> Change Password
//           </h2>
//           <button className="btn btn-ghost btn-sm btn-circle" onClick={onClose}>
//             <FiX size={16} />
//           </button>
//         </div>
//         {/*
//         <div className="divider my-0" /> */}

//         <Formik
//           initialValues={initialValues}
//           validationSchema={confirmPasswordSchema}
//           onSubmit={handleConfirmPassword}
//         >
//           {() => (
//             <Form className="flex flex-col gap-4">
//               <PasswordInput
//                 password="currentPassword"
//                 placeholder="Current password"
//                 label="Current Password"
//               />
//               <PasswordInput
//                 password="newPassword"
//                 placeholder="New password"
//                 label="New Password"
//               />
//               <PasswordInput
//                 password="confirmPassword"
//                 placeholder="Confirm new password"
//                 label="Confirm New Password"
//               />

//               <Motion.button
//                 type="submit"
//                 className="btn btn-warning w-full"
//                 disabled={passwordMutation.isPending}
//                 whileTap={{ scale: 0.97 }}
//                 transition={{ duration: 0.1 }}
//               >
//                 {passwordMutation.isPending && (
//                   <span className="loading loading-spinner loading-sm" />
//                 )}
//                 {passwordMutation.isPending ? "Updating..." : "Update Password"}
//               </Motion.button>
//             </Form>
//           )}
//         </Formik>
//       </Motion.div>
//     </Motion.div>
//   );
// };

// export default ProfilePasswordChange;

import { Formik, Form } from "formik";
import { FiLock, FiX } from "react-icons/fi";
import { motion } from "framer-motion";
import { confirmPasswordSchema } from "../../utils/validation";
import PasswordInput from "../../components/common/PasswordInput";
import { useChangePasswordMutation } from "../../hooks/auth/useAuthMutation";

const Motion = motion;

const ProfilePasswordChange = ({ isOpen, onClose }) => {
  const passwordMutation = useChangePasswordMutation();

  const initialValues = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const handleSubmit = (values) => {
    const { currentPassword, newPassword } = values;
    passwordMutation.mutate({ currentPassword, newPassword });
  };

  if (!isOpen) return null;

  return (
    <Motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <Motion.div
        className="relative bg-base-100 rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-5"
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Loading Overlay */}
        {passwordMutation.isPending && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-2xl z-10">
            <span className="loading loading-spinner" />
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold flex items-center gap-2">
            <FiLock size={18} /> Change Password
          </div>
          <button className="btn btn-ghost btn-sm btn-circle" onClick={onClose}>
            <FiX size={16} />
          </button>
        </div>

        {/* Form */}
        <Formik
          initialValues={initialValues}
          validationSchema={confirmPasswordSchema}
          onSubmit={handleSubmit}
        >
          <Form className="flex flex-col gap-4">
            <PasswordInput
              password="currentPassword"
              placeholder="Current password"
              label="Current Password"
            />
            <PasswordInput
              password="newPassword"
              placeholder="New password"
              label="New Password"
            />
            <PasswordInput
              password="confirmPassword"
              placeholder="Confirm new password"
              label="Confirm New Password"
            />

            <Motion.button
              type="submit"
              className="btn btn-warning w-full"
              disabled={passwordMutation.isPending}
              whileTap={{ scale: 0.97 }}
            >
              {passwordMutation.isPending ? "Updating..." : "Update Password"}
            </Motion.button>
          </Form>
        </Formik>
      </Motion.div>
    </Motion.div>
  );
};

export default ProfilePasswordChange;
