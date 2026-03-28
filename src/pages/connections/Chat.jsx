import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { createSocketConnection } from "../../utils/socket";
import { useUniqueProfile } from "../../hooks/profile/useShowUniqueProfile";

const Chat = () => {
  const { userId: chatPartnerId } = useParams();
  const [message, setMessage] = useState([]);
  const [newMessage, setNewMessage] = useState("");

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

    socket.emit("joinChat", {
      firstName: currentUser?.firstName,
      IdUser: currentUserId,
      userId: chatPartnerId,
    });

    socket.on("messageReceived", ({ firstName, text }) => {
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
  }, [
    currentUserId,
    chatPartnerId,
    currentUser?.firstName,
    currentChatUser?.photoURL,
  ]);

  const handleSendMessages = () => {
    if (!newMessage.trim()) return;

    const socket = createSocketConnection();

    socket.emit("sendMessage", {
      firstName: currentUser.firstName, // ✅ FIXED
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
        name: currentUser.firstName, // ✅ FIXED
        avatar: currentUser.photoURL, // ✅ FIXED
        time: "now",
        status: "sent",
      },
    ]);

    setNewMessage("");
  };

  // ✅ Loading State
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // ✅ Error State
  if (error) {
    return (
      <div className="flex justify-center items-center h-[80vh] text-error">
        Failed to load chat user.
      </div>
    );
  }

  return (
    <div className="flex justify-center mt-6 px-3">
      <div className="w-full max-w-3xl h-[85vh] flex flex-col bg-base-100 shadow-2xl rounded-2xl border border-base-300 overflow-hidden">
        {/* HEADER */}
        <div className="h-1 w-full bg-gradient-to-r from-primary to-secondary" />

        <div className="px-5 py-3 border-b bg-base-200 flex items-center gap-3">
          <div className="avatar online">
            <div className="w-10 rounded-full ring-2 ring-primary/30">
              <img src={currentChatUser?.photoURL} alt="chat user" />
            </div>
          </div>

          <div className="flex flex-col">
            <h2 className="font-semibold text-base">
              {currentChatUser?.firstName} {currentChatUser?.lastName}
            </h2>
            <p className="text-xs text-success">Online</p>
          </div>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-base-100">
          {message.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "me" ? "justify-end" : "justify-start"
              }`}
            >
              <div className="flex items-end gap-2 max-w-[75%]">
                {msg.sender !== "me" && (
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      <img src={msg.avatar} alt="avatar" />
                    </div>
                  </div>
                )}

                <div>
                  <div className="text-[11px] text-base-content/60 mb-1 px-1">
                    {msg.sender !== "me" && msg.name}
                    <span className="ml-2 opacity-50">{msg.time}</span>
                  </div>

                  <div
                    className={`px-4 py-2 rounded-2xl text-sm shadow-sm
                    ${
                      msg.sender === "me"
                        ? "bg-primary text-white rounded-br-md"
                        : "bg-base-200 rounded-bl-md"
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
              className="input input-bordered w-full h-10 text-sm rounded-full px-4"
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

// import { useNavigate, useParams } from "react-router-dom";
// // import { useSelector } from "react-redux";
// // import { useEffect, useState, useRef } from "react";
// // import { createSocketConnection } from "../../utils/socket";
// // import { useUniqueProfile } from "../../hooks/profile/useShowUniqueProfile";
// // import ErrorPage from "../../components/common/ErrorPage";
// import { DEFAULT_AVATAR } from "../../utils/constants";
// import { IoIosArrowBack } from "react-icons/io";

// const Chat = () => {
//   // PARAM
//   const { userId: targetUserId } = useParams();

//   // CURRENT USER
//   // const user = useSelector((store) => store?.auth?.user);
//   const currentUserId = user?._id;
//   const navigate = useNavigate();

//   // // FETCH TARGET USER PROFILE
//   // const { data, isLoading, error } = useUniqueProfile(targetUserId);

//   // // SAFE ACCESS
//   // const firstName = data?.firstName;
//   // const lastName = data?.lastName;
//   // const photoURL = data?.photoURL;

//   // // CHAT STATE
//   // const [messages, setMessages] = useState([]);
//   // const [newMessage, setNewMessage] = useState("");

//   // const socketRef = useRef(null);
//   // const bottomRef = useRef(null);

//   // // SOCKET CONNECTION
//   // useEffect(() => {
//   //   if (!currentUserId || !targetUserId) return;

//   //   socketRef.current = createSocketConnection();

//   //   socketRef.current.emit("joinChat", {
//   //     firstName: user.firstName,
//   //     userId: currentUserId,
//   //     targetUserId,
//   //   });

//   //   socketRef.current.on("messageReceived", ({ firstName, text }) => {
//   //     setMessages((prev) => [
//   //       ...prev,
//   //       {
//   //         text,
//   //         sender: "other",
//   //         name: firstName,
//   //         time: new Date().toLocaleTimeString([], {
//   //           hour: "2-digit",
//   //           minute: "2-digit",
//   //         }),
//   //       },
//   //     ]);
//   //   });

//   //   return () => {
//   //     socketRef.current.disconnect(); // IMPORTANT
//   //   };
//   // }, [currentUserId, targetUserId]);

//   // // AUTO SCROLL
//   // useEffect(() => {
//   //   bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   // }, [messages]);

//   // // SEND MESSAGE
//   // const handleSendMessage = () => {
//   //   if (!newMessage.trim()) return;

//   //   socketRef.current.emit("sendMessage", {
//   //     firstName: user.firstName,
//   //     userId: currentUserId,
//   //     targetUserId,
//   //     text: newMessage,
//   //   });

//   //   setMessages((prev) => [
//   //     ...prev,
//   //     {
//   //       text: newMessage,
//   //       sender: "me",
//   //       name: user.firstName,
//   //       time: new Date().toLocaleTimeString([], {
//   //         hour: "2-digit",
//   //         minute: "2-digit",
//   //       }),
//   //     },
//   //   ]);

//   //   setNewMessage("");
//   // };

//   // // LOADING UI
//   // if (isLoading) {
//   //   return (
//   //     <div className="flex justify-center items-center min-h-[60vh]">
//   //       <span className="loading loading-spinner loading-lg text-primary"></span>
//   //     </div>
//   //   );
//   // }

//   // // ERROR UI
//   // if (error) {
//   //   return <ErrorPage />;
//   // }

//   return (
//     <div className="flex justify-center mt-6 px-3">
//       <div className="w-full max-w-3xl h-[85vh] flex flex-col bg-base-100 shadow-xl rounded-2xl border border-base-300 overflow-hidden">
//         {/* Header */}
//         <div className="h-1 w-full bg-gradient-to-r from-primary to-secondary" />

//         <div className="px-5 py-3 border-b bg-base-200 flex items-center gap-3">
//           <div className="avatar online flex justify-center items-center gap-3">
//             <button
//               className="w-8 h-8 text-3xl cursor-pointer hover:text-primary"
//               onClick={() => navigate(-1)}
//             >
//               <IoIosArrowBack />
//             </button>
//             <div className="w-9 rounded-full ring-2 ring-primary/30">
//               <img
//                 src={photoURL || DEFAULT_AVATAR}
//                 alt="chat user"
//                 onError={(e) => {
//                   e.currentTarget.src = DEFAULT_AVATAR;
//                 }}
//               />
//             </div>
//           </div>

//           <div>
//             <h2 className="font-semibold leading-tight">
//               {firstName ? `${firstName} ${lastName}` : "Loading..."}
//             </h2>
//             <p className="text-xs text-success">Online</p>
//           </div>
//         </div>

//         {/* Messages */}
//         <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
//           {messages.length === 0 ? (
//             <p className="text-center text-sm opacity-60">No messages yet</p>
//           ) : (
//             messages.map((msg, index) => (
//               <div
//                 key={index}
//                 className={`chat ${
//                   msg.sender === "me" ? "chat-end" : "chat-start"
//                 }`}
//               >
//                 <div className="chat-header text-xs opacity-70">
//                   {msg.name}
//                   <time className="ml-2">{msg.time}</time>
//                 </div>

//                 <div
//                   className={`chat-bubble ${
//                     msg.sender === "me" ? "chat-bubble-primary" : ""
//                   }`}
//                 >
//                   {msg.text}
//                 </div>
//               </div>
//             ))
//           )}

//           <div ref={bottomRef}></div>
//         </div>

//         {/* Input */}
//         <div className="px-4 py-3 border-t bg-base-200">
//           <div className="flex gap-2">
//             <input
//               type="text"
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") handleSendMessage();
//               }}
//               placeholder="Type a message..."
//               className="input input-bordered w-full input-sm h-10 text-sm"
//             />

//             <button
//               onClick={handleSendMessage}
//               disabled={!newMessage.trim()}
//               className="btn btn-primary btn-sm h-10"
//             >
//               Send
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Chat;
