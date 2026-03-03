import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createSocketConnection, disconnectSocket } from "../../utils/socket";

const Chat = () => {
  const { targetUserId } = useParams();
  const user = useSelector((store) => store?.auth?.user);
  const userId = user?._id;

  useEffect(() => {
    if (!userId || !targetUserId) return;
    const socket = createSocketConnection();
    // Join room
    socket.emit("joinChat", { userId, targetUserId });
    return () => {
      disconnectSocket();
    };
  }, [userId, targetUserId]);

  return (
    <div className="flex justify-center mt-4 px-2">
      <div className="w-full max-w-3xl h-[85vh] flex flex-col bg-base-100 shadow-xl rounded-xl border">
        <div className="p-4 border-b bg-base-200 rounded-t-xl">
          <h2 className="font-semibold text-lg">Chat</h2>
        </div>

        <div className="p-4 border-t bg-base-200 rounded-b-xl">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Type a message..."
              className="input input-bordered w-full"
            />
            <button className="btn btn-primary">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
