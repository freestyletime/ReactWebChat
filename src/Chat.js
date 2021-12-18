import React, { Component } from "react";
import { database, auth } from "./firebaseConfig";
import SignOut from "./SignOut";
import { onValue, push, ref, set } from "firebase/database";

/**
 * Chat Component => Chat, Signout
 */
class Chat extends Component {
  /**
   * Assemble every single message and send it to firebase(realtime database)
   */
  onMessageSend(event) {
    var input = document.getElementById("text-input");
    var text = input.value;
    if (text === "") return;

    var chat = {
      content: text,
      timestamp: Date.now(),
      uid: auth.currentUser.uid,
      profile:
        auth.currentUser.photoURL ||
        "https://raw.githubusercontent.com/ialimustufa/firebase-web-chat/master/web/images/profile_placeholder.png",
      timedate: new Date().toLocaleString("en-GB", { timeZone: "UTC" }),
      displayName: auth.currentUser.displayName
    };

    input.value = "";
    this.writeChatData(chat);
  }

  /**
   * When receving messages from firebase(realtime database),
   * we update the local data, render the screen, and scroll to the bottom of the chat window
   */
  scrollToBottom() {
    window.setTimeout(function () {
      var room = document.getElementById("chat-room");
      window.scrollTo(0, room.scrollHeight);
    }, 200);
  }

  /**
   * send the assembled data to firebase(realtime database)
   */
  async writeChatData(chat) {
    try {
      const postListRef = ref(database, "chats/");
      const newPostRef = push(postListRef);
      await set(newPostRef, {
        uid: chat.uid,
        content: chat.content,
        profile: chat.profile,
        timedate: chat.timedate,
        timestamp: chat.timestamp,
        displayName: chat.displayName
      });
    } catch (error) {
      alert(error.message);
    }
  }

  /**
   * React component lifecycle method,
   * we create a message listener so that we can detect anyone
   * who send message in the chat room at once
   */
  async componentDidMount() {
    const dbRef = ref(database, "chats/");
    try {
      onValue(dbRef, (snapshot) => {
        let chats = [];
        snapshot.forEach((childSnapshot) => {
          chats.push(childSnapshot.val());
        });
        this.setState({ chats: chats });
        this.scrollToBottom();
      });
    } catch (error) {
      alert(error.message);
    }
  }

  /**
   * style of the message on the left side (someone else)
   */
  leftText(s) {
    return (
      <div id={s.timestamp} className="text-end">
        <small>({s.timedate})</small> &nbsp;
        <mark>{s.displayName}</mark>
        &nbsp;
        <img
          alt="profile"
          class="rounded-circle"
          src={s.profile}
          width="35"
          height="35"
        />
        <p className="msg_cotainer">{s.content}</p>
      </div>
    );
  }

  /**
   * style of the message on the right side (own)
   */
  rightText(s) {
    return (
      <div id={s.timestamp} className="text-start">
        <img
          alt="profile"
          class="rounded-circle"
          src={s.profile}
          width="35"
          height="35"
        />
        &nbsp;
        <mark>{s.displayName}</mark>&nbsp;<small>({s.timedate})</small>
        <p>{s.content}</p>
      </div>
    );
  }

  constructor(props) {
    super(props);
    this.onMessageSend = this.onMessageSend.bind(this);
    this.state = {
      chats: []
    };
  }

  render() {
    const onSignOutClickListener = this.props.onSignOutClickListener;

    return (
      <div id="chat-room" class="card">
        <div class="card-header sticky-top bg-light">
          <SignOut onSignOutClick={onSignOutClickListener} />
        </div>
        <div class="card-body">
          <div id="chat">
            {this.state.chats.map((s) => (
              <>
                {s.uid === auth.currentUser.uid
                  ? this.leftText(s)
                  : this.rightText(s)}{" "}
              </>
            ))}
          </div>
        </div>
        <div class="card-footer bg-light">
          <div class="container mt-3">
            <div class="d-grid gap-3">
              <textarea
                id="text-input"
                class="form-control type_msg"
                placeholder="Type your message..."
              />
              <button
                onClick={this.onMessageSend}
                type="button"
                class="btn btn-primary btn-block"
              >
                Send message
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Chat;
