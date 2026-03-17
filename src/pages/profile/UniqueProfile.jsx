import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const UniqueProfile = () => {
  const { targetUserId } = useParams();
  const navigate = useNavigate();

  console.log(targetUserId);

  return (
    <div className="flex justify-center items-center mt-15">
      <div className="card bg-base-100 image-full w-96 shadow-sm">
        <figure>
          <img
            src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
            alt="Shoes"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">Card Title</h2>
          <p>
            A card component has a figure, a body part, and inside body there
            are title and actions parts
          </p>
          <div className="card-actions justify-end">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/connections")}
            >
              Back to Connections
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniqueProfile;
