import { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { useDocumentTitle, useScrollTop } from '@/hooks';
import { Link, useLocation } from "react-router-dom";
import { ADMIN_CHAT_USER } from '@/constants/routes';
import { withRouter } from 'react-router-dom';
import { ImageLoader } from '@/components/common';


import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import firebase from "firebase/app";

import fb from '@/services/firebase';

import db from '../../../services/firebase'

import "./Dashboard.css";

const AdminChat = () => {

  useScrollTop();
  useDocumentTitle('My Account | Salinaka');

  const [users, setUsers] = useState([]);

  useEffect( async() => {
    let db = app.firestore();
    let auth = app.auth();
    const user = auth.currentUser;
    let listUidUser = [];
    db.collection("users").onSnapshot((doc) => {
      let usersList = [];

      doc.docs.map(doc => {
            if(doc.id !== user.uid){
              let userTmp = doc.data();
              userTmp.uid = doc.id;
              usersList.push(userTmp)
              let messageId = doc.id + user.uid;
              listUidUser.push(doc.id);
            }
        });
        
    listUidUser.map( async(id) => {
      // let doc2 = db.collection("messages").doc(id+user.uid).collection("chat").orderBy("createdAt" , "desc").limit(1).get();
      const doc = await fb.getSingleChatInfo(id+user.uid);
      doc.docs.map( data => {
        let listUser = [];
        usersList.map( (user1) => {
          if(user1.uid === id){

          user1.text = data.data().text;
          user1.isUser = data.data().from === user.uid;
          }
          listUser.push(user1)
        })
        setUsers(listUser);
      })
    })
        setUsers(usersList);
    }); 
    
  }, []);

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "15px" }}>
          </div>

          <div className="new">
            <div
              style={{
                height: "450px",
                overflowY: "auto",

                padding: "7px",
                marginLeft: "-10px",
                marginRight: "-10px",
                borderRadius: "5px"
              }}
            >
              {users.map((user) => {
                if(user.text){
                  return (
                    <Link key={user.uid} to={{
                      pathname: ADMIN_CHAT_USER,
                      state: user
                    }}>
                      <div className="basket-item-wrapper">
                        <div className="basket-item-img-wrapper">
                          <ImageLoader
                            alt={user.name ? user.name : (user.fullname ? user.fullname : "unknown")}
                            className="basket-item-img"
                            src={user.avatar}
                          />
                        </div>
                        <div className="basket-item-details">
                          
                            <h4 className="underline basket-item-name">
                              {user.name ? user.name : (user.fullname ? user.fullname : "unknown")}
                            </h4>
                          <div className="basket-item-specs">
                            <div>
                              <span className="spec-title">{user.email}</span>
                            </div>
                            <div>
                              <span style={user.text ? { color: 'black' } : { color: '#8d8d8d' }}
                                    >{user.isUser ? "User: " : "You: "} {user.text ? user.text : "No message"}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                }
              })}
            </div>
          </div>
    </div>
  );
}

export default withRouter(AdminChat);
