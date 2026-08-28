const PageLoader = ({ label = "Loading page", fullPage = false }) => (
  <div
    role="status"
    aria-label={label}
    className={`flex items-center justify-center ${fullPage ? "min-h-dvh" : "min-h-[50vh]"}`}
  >
    <span className="loading loading-spinner loading-lg text-primary" />
    <span className="sr-only">{label}</span>
  </div>
);

export default PageLoader;
