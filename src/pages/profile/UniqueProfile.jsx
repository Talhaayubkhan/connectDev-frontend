import { Link, useNavigate, useParams } from "react-router-dom";
import { useUniqueProfile } from "../../hooks/profile/useShowUniqueProfile";
import ErrorPage from "../../components/common/ErrorPage";
import { DEFAULT_AVATAR } from "../../utils/constants";
import { FiCalendar } from "react-icons/fi";
import { BsGenderAmbiguous } from "react-icons/bs";
import { IoMdArrowBack } from "react-icons/io";

const UniqueProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useUniqueProfile(userId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }
  if (error) {
    return <ErrorPage />;
  }

  if (!data) {
    return <p className="text-center mt-10">No user found</p>;
  }

  const { _id, firstName, lastName, photoURL, age, gender, skills, about } =
    data;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="card bg-base-200 shadow-lg p-6">
        {/* Top Section */}
        <div className="flex items-center gap-6">
          <div className="avatar">
            <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img
                src={photoURL || DEFAULT_AVATAR}
                alt={firstName}
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_AVATAR;
                }}
              />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold">
              {firstName} {lastName}
            </h2>

            <div className="flex items-center gap-4 text-sm text-base-content/60 mt-1">
              {age && (
                <span className="flex items-center gap-1">
                  <FiCalendar size={14} /> {age} yrs
                </span>
              )}
              {gender && (
                <span className="flex items-center gap-1">
                  <BsGenderAmbiguous size={14} /> {gender}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* About Section */}
        {about && (
          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-1">About</h3>
            <p className="text-base-content/70">{about}</p>
          </div>
        )}

        {/* Skills Section */}
        {skills?.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <span key={i} className="badge badge-outline badge-md">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center mt-4">
          <button
            className="btn btn-ghost"
            onClick={() => navigate("/connections")}
          >
            <IoMdArrowBack />
            Back
          </button>

          <div className="flex">
            <Link to={`/chat/${_id}`}>
              <button className="btn btn-primary">Message</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniqueProfile;
