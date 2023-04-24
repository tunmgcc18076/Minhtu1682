import { useRef, useState, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./SelectedUser.css";
import SendIcon from "@mui/icons-material/Send";
import UploadIcon from "@mui/icons-material/Upload";
import { withRouter } from 'react-router-dom';
import { ADMIN_CHAT } from '@/constants/routes';
import Messages from "./Messages";

import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import firebase from "firebase/app";

import fb from '@/services/firebase';

import db from '../../../services/firebase'

const ChatUser = () => {
  
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState("");
  const [doc, setDoc] = useState();

  let location = useLocation();
  const user2 = location.state;
  const handleSubmit = async (e) => {
    e.preventDefault();
    addDocMsg();
  };

  const addDocMsg = async () => {
    
    let adminUid = firebase.auth().currentUser.uid;
    const messageId = user2.uid + adminUid;

    let serverStamp = firebase.firestore.Timestamp;
    const id = await fb.generateMessageKey();
    let message = {
      text: text,
      from: adminUid,
      to: user2.uid,
      createdAt: serverStamp.now()
    };
    await fb.addMessage(messageId,id, message);
    setText("");
  };
  
  useEffect( async() => {
    let db = app.firestore();
    const messageId = user2.uid + "WsSmtS4SnjWnCjoFLyf1EuRbdmJ3";
    db.collection("messages").doc(messageId).collection("chat").orderBy("createdAt").onSnapshot((doc) => {
      let msgs = [];
      doc.docs.map(doc => {
        
            msgs.push(doc.data())
        });
        
        setMsgs(msgs);
    });
  }, []);

  return (
    <div>
      <div className="content-chat">
          <Link to={ADMIN_CHAT}>
            <svg
              style={{
                width: "30px",
                height: "30px",
                float: "left",
                cursor: "pointer",
                color: "#502A75"
              }}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z"
                clip-rule="evenodd"
              />
            </svg>
          </Link>
          <div style={{ textAlign: "center", marginBottom:'15px' }}>
            <h2
              style={{
                marginTop: "10px"
              }}
            >
              {user2.name ? user2.name : (user2.fullname ? user2.fullname : "unknown")}
              {user2.isOnline ? (
                <span style={{ color: "green" }}>•</span>
              ) : (
                <span style={{ color: "red" }}>•</span>
              )}
            </h2>
            <small >{user2.email}</small>
            
          </div>

          <div
            style={{
              height: "400px",
              overflowY: "auto",
              backgroundColor: "#eaebff",
              padding: "7px",
              borderRadius: "5px"
            }}
            className="new"
          >
            {msgs.length
              ? msgs.map((msg, i) => (
                  <Messages msg={msg} userUid={user2} />
                ))
              : null}
            
          </div><div className="messageBox">
            <input
              type="file"
              id="upimg"
              accept="image/*"
              style={{ display: "none" }}
            />

            <div className="textA">
              <textarea
                id="message"
                name="message"
                rows={1}
                cols={30}
                placeholder="Type your message here"
                defaultValue={""}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
            <button
              onClick={(e) => handleSubmit(e)}
              id="send"
              className="button-s1"
              tooltip="Send"
              flow="left"
            >
              <span className="material-icons headerIcon">
                <SendIcon />
              </span>
            </button>
          </div>
        </div>
    </div>
  );
}

export default withRouter(ChatUser);
