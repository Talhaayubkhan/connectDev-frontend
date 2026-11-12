import { Field } from "formik";
import { FiAlertCircle } from "react-icons/fi";

const FieldError = ({ id, message }) => {
  if (!message) return null;

  return (
    <div
      id={id}
      role="alert"
      className="mt-1 flex items-center gap-1 text-xs text-error"
    >
      <FiAlertCircle aria-hidden="true" className="h-3 w-3 shrink-0" />
      <span>{message}</span>
    </div>
  );
};

const TextInputField = ({
  name,
  label,
  type = "text",
  placeholder,
  autoComplete,
  icon: Icon,
}) => {
  return (
    <Field name={name}>
      {({ field, meta }) => {
        const hasError = Boolean(meta.touched && meta.error);
        const errorId = `${name}-error`;

        return (
          <div>
            <label htmlFor={name} className="label py-0 pb-1">
              <span className="label-text text-xs">{label}</span>
            </label>

            <div className={Icon ? "relative" : undefined}>
              {Icon && (
                <Icon
                  aria-hidden="true"
                  className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-sm text-base-content/40"
                />
              )}

              <input
                {...field}
                id={name}
                type={type}
                placeholder={placeholder}
                autoComplete={autoComplete}
                aria-invalid={hasError}
                aria-describedby={hasError ? errorId : undefined}
                spellCheck={type === "email" ? false : undefined}
                className={`input input-bordered w-full ${
                  Icon ? "pl-9" : ""
                } ${hasError ? "input-error" : ""}`}
              />
            </div>

            <FieldError id={errorId} message={hasError ? meta.error : null} />
          </div>
        );
      }}
    </Field>
  );
};

export default TextInputField;
export { FieldError };
