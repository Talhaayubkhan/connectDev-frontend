import { useState } from "react";
import { Field, ErrorMessage } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const PasswordInput = ({ password, placeholder }) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      {" "}
      {/* Password */}
      <div className="relative">
        <Field
          type={show ? "text" : "password"}
          name={password}
          placeholder={placeholder}
          className="input input-bordered w-full pr-10 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
        />
        <span
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
          onClick={() => setShow(!show)}
        >
          {show ? <FaEyeSlash /> : <FaEye />}
        </span>
        <ErrorMessage
          name={password}
          component="div"
          className="text-red-500 text-sm mt-1"
        />
      </div>
    </div>
  );
};

export default PasswordInput;
