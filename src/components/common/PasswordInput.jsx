import { useField } from "formik";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const PasswordInput = ({
  name,
  password,
  label,
  placeholder,
  autoComplete = "current-password",
}) => {
  const fieldName = name || password;
  const [field, meta] = useField(fieldName);
  const [show, setShow] = useState(false);
  const errorId = `${fieldName}-error`;
  const hasError = meta.touched && Boolean(meta.error);

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={fieldName} className="text-xs font-medium">
        {label || placeholder}
      </label>
      <div className="relative">
        <input
          {...field}
          id={fieldName}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          className={`input input-bordered w-full pr-12 ${hasError ? "input-error" : ""}`}
        />
        <button
          type="button"
          aria-label={show ? `Hide ${label || "password"}` : `Show ${label || "password"}`}
          aria-pressed={show}
          className="absolute inset-y-0 right-0 flex min-h-11 min-w-11 items-center justify-center text-base-content/60 transition hover:text-base-content"
          onClick={() => setShow((isVisible) => !isVisible)}
        >
          {show ? <FaEyeSlash aria-hidden="true" /> : <FaEye aria-hidden="true" />}
        </button>
      </div>
      {hasError && (
        <p id={errorId} className="text-xs text-error">
          {meta.error}
        </p>
      )}
    </div>
  );
};

export default PasswordInput;
