import { useField } from "formik";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { FieldError } from "./TextInputFields";

const PasswordInput = ({
  name,
  label,
  placeholder,
  autoComplete = "current-password",
}) => {
  const [field, meta] = useField(name);
  const [show, setShow] = useState(false);
  const errorId = `${name}-error`;
  const hasError = Boolean(meta.touched && meta.error);

  return (
    <div>
      <label htmlFor={name} className="label py-0 pb-1">
        <span className="label-text text-xs">{label}</span>
      </label>

      <div className="relative">
        <input
          {...field}
          id={name}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          className={`input input-bordered w-full pr-12 ${hasError ? "input-error" : ""}`}
        />

        <button
          type="button"
          aria-label={
            show ? `Hide ${label || "password"}` : `Show ${label || "password"}`
          }
          aria-pressed={show}
          className="absolute inset-y-0 right-0 flex min-h-11 min-w-11 items-center justify-center text-base-content/60 transition hover:text-base-content"
          onClick={() => setShow((isVisible) => !isVisible)}
        >
          {show ? (
            <FaEyeSlash aria-hidden="true" />
          ) : (
            <FaEye aria-hidden="true" />
          )}
        </button>
      </div>

      <FieldError id={errorId} message={hasError ? meta.error : null} />
    </div>
  );
};

export default PasswordInput;
