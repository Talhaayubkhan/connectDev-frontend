import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { createSocketConnection } from "../../utils/socket";
import { useUniqueProfile } from "../../hooks/profile/useShowUniqueProfile";
import { IoIosArrowBack } from "react-icons/io";
import { EVENTS } from "../../utils/constants";

const Chat = () => {
  const { userId: chatPartnerId } = useParams();
  const [message, setMessage] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const navigate = useNavigate();
  const socketRef = useRef(null);

  const {
    data: currentChatUser,
    isLoading,
    error,
  } = useUniqueProfile(chatPartnerId);

  const currentUser = useSelector((store) => store?.auth?.user);
  const currentUserId = currentUser?._id;

  useEffect(() => {
    if (!currentUserId || !chatPartnerId) return;

    const socket = createSocketConnection();
    socketRef.current = socket;

    socket.emit("joinChat", {
      firstName: currentUser?.firstName,
      IdUser: currentUserId,
      userId: chatPartnerId,
    });

    // ✅ REMOVE OLD LISTENER BEFORE ADDING NEW ONE
    socket.off(EVENTS.MESSAGE_RECEIVED);

    socket.on(EVENTS.MESSAGE_RECEIVED, ({ firstName, text }) => {
      setMessage((prev) => [
        ...prev,
        {
          id: Date.now(),
          text,
          sender: "other",
          name: firstName,
          avatar:
            currentChatUser?.photoURL ||
            "https://default-avatar.com/avatar.png",
          time: "now",
        },
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUserId, chatPartnerId]);

  const handleSendMessages = () => {
    if (!newMessage.trim()) return;

    socketRef.current.emit(EVENTS.SEND_MESSAGE, {
      firstName: currentChatUser?.firstName,
      IdUser: currentUserId,
      userId: chatPartnerId,
      text: newMessage,
    });

    setMessage((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: newMessage,
        sender: "me",
        name: currentChatUser.firstName,
        avatar: currentChatUser.photoURL,
        time: "now",
        status: "sent",
      },
    ]);

    setNewMessage("");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[80vh] text-error">
        Failed to load chat user.
      </div>
    );
  }

  return (
    <div className="flex justify-center mt-6 px-3">
      <div className="w-full max-w-3xl h-[85vh] flex flex-col bg-base-100 shadow-xl rounded-2xl border border-base-300 overflow-hidden">
        {/* HEADER */}
        <div className="h-1 w-full bg-gradient-to-r from-primary to-secondary" />

        <div className="px-4 py-3 border-b bg-base-200 flex items-center justify-between">
          {/* LEFT SIDE */}
          <div className="flex items-center gap-3">
            <button
              className="p-1 rounded-full hover:bg-primary transition"
              onClick={() => navigate(-1)}
            >
              <IoIosArrowBack size={25} />
            </button>

            <div className="avatar online">
              <div className="w-10 rounded-full ring-2 ring-primary/30">
                <img src={currentChatUser?.photoURL} alt="chat user" />
              </div>
            </div>

            <div>
              <h2 className="font-semibold text-sm leading-tight">
                {currentChatUser?.firstName} {currentChatUser?.lastName}
              </h2>
              <p className="text-xs text-success">Online</p>
            </div>
          </div>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {message.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "me" ? "justify-end" : "justify-start"
              }`}
            >
              <div className="flex items-end gap-2 max-w-[70%]">
                {msg.sender !== "me" && (
                  <div className="avatar">
                    <div className="w-7 rounded-full">
                      <img src={msg.avatar} alt="avatar" />
                    </div>
                  </div>
                )}

                <div>
                  <div className="text-[10px] text-base-content/60 mb-1 px-1">
                    {msg.sender !== "me" && msg.name}
                    <span className="ml-2 opacity-50">{msg.time}</span>
                  </div>

                  <div
                    className={`px-4 py-2 rounded-2xl text-sm shadow
                    ${
                      msg.sender === "me"
                        ? "bg-primary text-white rounded-br-sm"
                        : "bg-base-200 rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>

                  {msg.sender === "me" && (
                    <div className="text-[10px] text-right mt-1 opacity-50 pr-1">
                      {msg.status}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* INPUT */}
        <div className="px-4 py-3 border-t bg-base-200">
          <div className="flex items-center gap-2">
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              type="text"
              placeholder="Type a message..."
              className="input input-bordered w-full h-10 text-sm rounded-full px-4 focus:outline-none"
            />
            <button
              onClick={handleSendMessages}
              className="btn btn-primary btn-sm rounded-full px-5 h-10"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
