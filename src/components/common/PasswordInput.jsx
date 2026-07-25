import { useState } from "react";
import { Field, ErrorMessage } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const PasswordInput = ({ password, placeholder }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      <div className="relative">
        <Field
          type={show ? "text" : "password"}
          name={password}
          placeholder={placeholder}
          className="input input-bordered w-full pr-10"
        />
        {/* A button makes this control keyboard-accessible and announces its state. */}
        <button
          type="button"
          aria-label={show ? "Hide password" : "Show password"}
          aria-pressed={show}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content transition"
          onClick={() => setShow((isVisible) => !isVisible)}
        >
          {show ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>

      <ErrorMessage
        name={password}
        component="div"
        className="text-error text-xs mt-1"
      />
    </div>
  );
};

export default PasswordInput;
