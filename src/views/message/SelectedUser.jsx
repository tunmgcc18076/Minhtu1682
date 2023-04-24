import { useRef, useState, useContext, useEffect } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { SIGNIN } from '@/constants/routes';

import { useDispatch, useSelector } from 'react-redux';
import FileUpload from "./FileUpload";

import SendIcon from "@mui/icons-material/Send";
import UploadIcon from "@mui/icons-material/Upload";

import "./SelectedUser.css";
import Messages from "../../components/message/Messages";

import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

import { useAuthState } from 'react-firebase-hooks/auth';

import firebase from "firebase/app";

import fb from '@/services/firebase';

import db from '../../services/firebase'


// import * as fb from 'firebase/firebase';

import { useCollectionData } from 'react-firebase-hooks/firestore';


import chatboat_icon1 from './chatboat_icon1.png'

export default function SelectedUser() {

  const history = useHistory();

  const { profile, isAuthenticating } = useSelector((state) => ({
    profile: state.profile,
    isAuthenticating: state.app.isAuthenticating
  }));


  const [showBot, setBot] = useState(false);
  
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState("");
  const [doc, setDoc] = useState();

  function handleBot() {
    const botState = !showBot;  // const [showBot, toggleBot] = useState(false);

    setBot(botState);
  }

  const [messages, setMessages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    addDocMsg();
  };

  const addDocMsg = async () => {
    
  if(user === null || ! user){
    history.push(SIGNIN);
  }
  const messageId = user + "WsSmtS4SnjWnCjoFLyf1EuRbdmJ3";

    let serverStamp = firebase.firestore.Timestamp;
    const id = await fb.generateMessageKey();
    let message = {
      text: text,
      from: user,
      to: "WsSmtS4SnjWnCjoFLyf1EuRbdmJ3",
      createdAt: serverStamp.now()
    };
    await fb.addMessage(messageId,id, message);
    setText("");
    addAnswer();
  };

  const addAnswer = async () => {
    
    let answer = '';
    if(await generateAnswer(text) == ''){
      return;
    }
    const messageId = user + "WsSmtS4SnjWnCjoFLyf1EuRbdmJ3";
  
      let serverStamp = firebase.firestore.Timestamp;
      const id = await fb.generateMessageKey();
      let message = {
        text: await generateAnswer(text),
        from: "WsSmtS4SnjWnCjoFLyf1EuRbdmJ3",
        to: user,
        createdAt: serverStamp.now()
      };
      await fb.addMessage(messageId,id, message);
    };

    const generateAnswer = async(text) => {
      let newText = (text + "").toLocaleLowerCase();
  
      let product = await fb.getProducts();

      let answer = '';
      if(newText.includes("hello")){
        answer =  "Hi, can I help you? You can leave your phone number so that we can easily contact you."
      }else if(product.products){
        for(let i = 0; i < product.products.length; i++){
          if(newText.includes(product.products[i].name_lower)){
            answer =  `Are you interested in product ${product.products[i].name} with the price of ${product.products[i].price} $.\nHere is more information about the product: ${product.products[i].description}`;
          }
        }
      }
      return answer;
    };

  useEffect( async() => {
    let db = app.firestore();

    let user1id = firebase.auth().currentUser.uid;
    setUser(user1id);
    
    const messageId = user1id + "WsSmtS4SnjWnCjoFLyf1EuRbdmJ3";

    

    db.collection("messages").doc(messageId).collection("chat").orderBy("createdAt").onSnapshot((doc) => {
      let msgs = [];
      doc.docs.map(doc => {
            if(doc.data().from === user1id || (doc.data().to === user1id)){
              msgs.push(doc.data())
            }
        });
        
        setMsgs(msgs);
    });
    
    
  }, []);

  return (
    <div>
        {showBot && (
          <div className='bot'>
          <div className="titleChat">
            <h4 style={{color: "white", marginLeft: "20px"}}>Chat room</h4>
          </div>
          <div
            style={{
              height: "400px",
              overflowY: "auto",
              backgroundColor: "#f7f8fb",
              padding: "7px",
              borderRadius: "5px"
            }}
          >
            {msgs.length
              ? msgs.map((msg, i) => (
                  <Messages msg={msg} userUid={user} userAvatar={profile.avatar} />
                ))
              : null}
          </div>
          <div>
          <div className="messageBox">
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
        )}
        <button className="app-chatbot-button" onClick={handleBot}>
          <img src={chatboat_icon1} className="botIcon"/>
        </button>
    </div>
  );
}
