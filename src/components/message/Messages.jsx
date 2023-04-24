import "./Messages.css"
import adminAvatar from './admin.png'
import { useEffect, useRef } from "react";

export default function Messages({ msg, userUid, userAvatar }) {
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msg]);

  return (
    <div ref={scrollRef} className="chatContainer">
        {msg.from === userUid ? (
          <img src={userAvatar} className="botAvatar"/>
        ) : (
          <img src={adminAvatar} className="botAvatar"/>
        )}
        <p>{msg.text ? msg.text : ""}</p>

        <br />
      {msg.media ? (
        <img src={msg.media} style={{ width: "200px", height: "200px" }} />
      ) : null}
      <br />
    </div>
  );
}
