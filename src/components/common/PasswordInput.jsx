// import { useState } from "react";
// import { Field, ErrorMessage } from "formik";
// import { FaEye, FaEyeSlash } from "react-icons/fa";

// const PasswordInput = ({ password, placeholder }) => {
//   const [show, setShow] = useState(false);
//   return (
//     <div>
//       {" "}
//       {/* Password */}
//       <div className="relative">
//         <Field
//           type={show ? "text" : "password"}
//           name={password}
//           placeholder={placeholder}
//           className="input input-bordered w-full pr-10 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
//         />
//         <span
//           className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
//           onClick={() => setShow(!show)}
//         >
//           {show ? <FaEyeSlash /> : <FaEye />}
//         </span>
//         <ErrorMessage
//           name={password}
//           component="div"
//           className="text-red-500 text-sm mt-1"
//         />
//       </div>
//     </div>
//   );
// };

// export default PasswordInput;

import { useState } from "react";
import { Field, ErrorMessage } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa";

// label prop makes it fully self-contained — no need for label outside
const PasswordInput = ({ password, placeholder, label }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      {/* ✅ optional label handled inside component */}
      {label && (
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
      )}

      {/* Input + toggle */}
      <div className="relative">
        <Field
          type={show ? "text" : "password"}
          name={password}
          placeholder={placeholder}
          className="input input-bordered w-full pr-10"
        />
        <span
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-base-content/50 hover:text-base-content transition"
          onClick={() => setShow(!show)}
        >
          {show ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      {/* ✅ ErrorMessage outside relative div — not trapped inside positioning context */}
      <ErrorMessage
        name={password}
        component="div"
        className="text-error text-xs mt-1"
      />
    </div>
  );
};

export default PasswordInput;
