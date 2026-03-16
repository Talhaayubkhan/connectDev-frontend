// const Chat = () => {
//   const { targetUserId } = useParams();
//   const chatUserLabel = targetUserId
//     ? `User ${targetUserId.slice(0, 6)}`
//     : "Chat User";
//   const user = useSelector((store) => store?.auth?.user);
//   const userId = user?._id;
//   // console.log(userId);

//   const messages = [
//     {
//       id: 1,
//       text: "You were the Chosen One!",
//       sender: "other",
//       name: "Obi-Wan Kenobi",
//       time: "12:45",
//       avatar: "https://img.daisyui.com/images/profile/demo/kenobee@192.webp",
//       status: "Delivered",
//     },
//     {
//       id: 2,
//       text: "I hate you!",
//       sender: "me",
//       name: "You",
//       time: "12:46",
//       avatar: "https://img.daisyui.com/images/profile/demo/anakeen@192.webp",
//       status: "Seen",
//     },
//   ];

//   useEffect(() => {
//     if (!userId || !targetUserId) return;

//     const socket = createSocketConnection();

//     socket.emit("joinChat", {
//       firstName: user.firstName,
//       userId,
//       targetUserId,
//     });

//     return () => {
//       socket.off();
//     };
//   }, [userId, targetUserId]);

//   return (
//     <div className="flex justify-center mt-6 px-3">
//       <div className="w-full max-w-3xl h-[85vh] flex flex-col bg-base-100 shadow-xl rounded-2xl border border-base-300 overflow-hidden">
//         {/* HEADER */}
//         <div className="h-1 w-full bg-gradient-to-r from-primary to-secondary" />
//         <div className="px-5 py-3 border-b bg-base-200 flex items-center gap-3">
//           <div className="avatar online">
//             <div className="w-9 rounded-full ring-2 ring-primary/30">
//               <img
//                 src="https://img.daisyui.com/images/profile/demo/kenobee@192.webp"
//                 alt="chat user"
//               />
//             </div>
//           </div>
//           <div>
//             <h2 className="font-semibold text-base-content leading-tight">
//               {chatUserLabel}
//             </h2>
//             <p className="text-xs text-success">Online</p>
//           </div>
//         </div>

//         {/* MESSAGES AREA */}
//         <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
//           {messages.map((msg) => (
//             <div
//               key={msg.id}
//               className={`chat ${msg.sender === "me" ? "chat-end" : "chat-start"}`}
//             >
//               <div className="chat-image avatar">
//                 <div className="w-9 rounded-full ring-1 ring-base-300">
//                   <img src={msg.avatar} alt="avatar" />
//                 </div>
//               </div>

//               <div className="chat-header text-xs text-base-content/60 mb-0.5">
//                 {msg.name}
//                 <time className="opacity-50 ml-2">{msg.time}</time>
//               </div>

//               <div
//                 className={`chat-bubble text-sm ${msg.sender === "me" ? "chat-bubble-primary" : ""}`}
//               >
//                 {msg.text}
//               </div>

//               <div className="chat-footer opacity-40 text-xs mt-0.5">
//                 {msg.status}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* INPUT AREA */}
//         <div className="px-4 py-3 border-t bg-base-200">
//           <div className="flex gap-2">
//             <input
//               type="text"
//               placeholder="Type a message..."
//               className="input input-bordered w-full input-sm h-10 text-sm"
//             />
//             <button className="btn btn-primary btn-sm h-10">Send</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { createSocketConnection } from "../../utils/socket";

const Chat = () => {
  const { targetUserId } = useParams();

  const user = useSelector((store) => store?.auth?.user);
  const userId = user?._id;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!userId || !targetUserId) return;

    socketRef.current = createSocketConnection();

    socketRef.current.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId,
    });

    socketRef.current.on("messageReceived", ({ firstName, text }) => {
      setMessages((prev) => [
        ...prev,
        {
          text,
          sender: "other",
          name: firstName,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    });

    return () => {
      socketRef.current.off("messageReceived");
    };
  }, [userId, targetUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    socketRef.current.emit("sendMessage", {
      firstName: user.firstName,
      userId,
      targetUserId,
      text: newMessage,
    });

    setMessages((prev) => [
      ...prev,
      {
        text: newMessage,
        sender: "me",
        name: user.firstName,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    setNewMessage("");
  };

  return (
    <div className="flex justify-center mt-6 px-3">
      <div className="w-full max-w-3xl h-[85vh] flex flex-col bg-base-100 shadow-xl rounded-2xl border border-base-300 overflow-hidden">
        {/* Header */}
        <div className="h-1 w-full bg-gradient-to-r from-primary to-secondary" />

        <div className="px-5 py-3 border-b bg-base-200 flex items-center gap-3">
          <div className="avatar online">
            <div className="w-9 rounded-full ring-2 ring-primary/30">
              <img src={user?.photoURL} alt="chat user" />
            </div>
          </div>

          <div>
            <h2 className="font-semibold leading-tight">
              {user?.firstName + " " + user?.lastName}
            </h2>
            <p className="text-xs text-success">Online</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {messages.length === 0 ? (
            <p className="text-center text-sm opacity-60">No messages yet</p>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`chat ${
                  msg.sender === "me" ? "chat-end" : "chat-start"
                }`}
              >
                <div className="chat-header text-xs opacity-70">
                  {msg.name}
                  <time className="ml-2">{msg.time}</time>
                </div>

                <div
                  className={`chat-bubble ${
                    msg.sender === "me" ? "chat-bubble-primary" : ""
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))
          )}

          <div ref={bottomRef}></div>
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t bg-base-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
              placeholder="Type a message..."
              className="input input-bordered w-full input-sm h-10 text-sm"
            />

            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="btn btn-primary btn-sm h-10"
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
