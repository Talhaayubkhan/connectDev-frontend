import { Link } from "react-router-dom";
import { ROUTES } from "../../utils/constants";

const ErrorPage = ({
  code = "404",
  message = "Page not found",
  subMessage = "The page you requested does not exist.",
  onRetry,
  fullPage = false,
}) => (
  <section
    className={`flex items-center justify-center bg-base-200 px-4 ${fullPage ? "min-h-dvh" : "min-h-[50vh] rounded-2xl"}`}
  >
    <div className="card w-full max-w-md gap-2 bg-base-100 p-6 text-center shadow-xl sm:p-8">
      <p className="text-6xl font-bold text-error sm:text-7xl">{code}</p>
      <h1 className="mt-2 text-xl font-semibold">{message}</h1>
      <p className="text-sm text-base-content/60">{subMessage}</p>
      <div className="mt-4 flex flex-col justify-center gap-2 sm:flex-row">
        {onRetry && (
          <button type="button" className="btn btn-outline" onClick={onRetry}>
            Try again
          </button>
        )}
        <Link to={ROUTES.HOME} className="btn btn-primary">
          Go home
        </Link>
      </div>
    </div>
  </section>
);

export default ErrorPage;
