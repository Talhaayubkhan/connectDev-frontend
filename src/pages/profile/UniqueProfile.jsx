import {
  FiArrowLeft,
  FiBriefcase,
  FiLock,
  FiMapPin,
  FiUser,
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import ErrorPage from "../../components/common/ErrorPage";
import PageLoader from "../../components/common/PageLoader";
import { useUniqueProfile } from "../../hooks/profile/useShowUniqueProfile";
import { DEFAULT_AVATAR, ROUTES } from "../../utils/constants";

const UniqueProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useUniqueProfile(userId);

  if (isLoading) return <PageLoader label="Loading profile" />;

  if (error?.response?.status === 403) {
    return (
      <section className="flex min-h-[50vh] items-center justify-center px-4 text-center">
        <div className="max-w-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-warning/10">
            <FiLock aria-hidden="true" className="text-2xl text-warning" />
          </div>
          <h1 className="text-lg font-semibold">Profile restricted</h1>
          <p className="mt-2 text-sm text-base-content/60">
            You need to be connected to view this profile.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => navigate(-1)}
            >
              Go back
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => navigate(ROUTES.FEED)}
            >
              Browse people
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (error?.response?.status === 404) {
    return (
      <section className="flex min-h-[50vh] items-center justify-center px-4 text-center">
        <div className="max-w-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-error/10">
            <FiUser aria-hidden="true" className="text-2xl text-error" />
          </div>
          <h1 className="text-lg font-semibold">User not found</h1>
          <p className="mt-2 text-sm text-base-content/60">
            This profile does not exist.
          </p>
          <button
            type="button"
            className="btn btn-primary btn-sm mt-6"
            onClick={() => navigate(ROUTES.FEED)}
          >
            Back to feed
          </button>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <ErrorPage
        code="500"
        message="Failed to load profile"
        subMessage="Check your connection and try again."
        onRetry={refetch}
      />
    );
  }
  if (!data) return null;

  const {
    firstName,
    lastName,
    photoURL,
    age,
    gender,
    skills,
    about,
    location,
    occupation,
  } = data;
  const fullName =
    [firstName, lastName].filter(Boolean).join(" ") || "Developer";

  return (
    <article className="mx-auto max-w-2xl px-1 py-6 sm:px-4 sm:py-10">
      <div className="overflow-hidden rounded-xl bg-base-100 shadow-md">
        <div className="relative h-24 bg-gradient-to-r from-primary to-secondary">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-circle btn-ghost btn-sm absolute left-3 top-3 bg-black/20 text-white hover:bg-black/30"
            aria-label="Go back"
          >
            <FiArrowLeft aria-hidden="true" />
          </button>
        </div>
        <div className="relative px-4 pb-6 sm:px-6">
          <div className="relative -mt-12 mb-4 h-24 w-24 overflow-hidden rounded-full bg-base-200 ring-4 ring-base-100">
            <img
              src={photoURL || DEFAULT_AVATAR}
              alt={`${fullName}'s profile`}
              className="h-full w-full object-cover"
              onError={(event) => {
                event.currentTarget.src = DEFAULT_AVATAR;
              }}
            />
          </div>
          <h1 className="text-xl font-bold sm:text-2xl">{fullName}</h1>
          {(age || gender || location || occupation) && (
            <div className="mt-2 flex flex-wrap gap-3 text-sm text-base-content/60">
              {age && <span>{age} years</span>}
              {gender && <span className="capitalize">{gender}</span>}
              {location && (
                <span className="flex items-center gap-1">
                  <FiMapPin aria-hidden="true" /> {location}
                </span>
              )}
              {occupation && (
                <span className="flex items-center gap-1">
                  <FiBriefcase aria-hidden="true" /> {occupation}
                </span>
              )}
            </div>
          )}
          {about && (
            <section className="mt-5">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-base-content/50">
                About
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-base-content/70">
                {about}
              </p>
            </section>
          )}
          {skills?.length > 0 && (
            <section className="mt-5">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-base-content/50">
                Skills
              </h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="badge badge-primary badge-outline"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}
          <div className="mt-6 border-t border-base-200 pt-4">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => navigate(-1)}
            >
              <FiArrowLeft aria-hidden="true" /> Back
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default UniqueProfile;
