import React, { Component } from "react";
import SignIn from "./SignIn";
import Chat from "./Chat";
import { signOut, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, provider } from "./firebaseConfig";

class App extends Component {
  /**
   * Firebase => sign in with google account
   */
  async googleSignIn() {
    try {
      var result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      this.setState({ isSign: true, user: user });
    } catch (error) {
      this.setState({ errorMsg: error.message });
    }
  }
  /**
   * Firebase => sign out
   */
  async googleSignOut() {
    try {
      await signOut(auth);
      this.setState({ isSign: false, token: null });
    } catch (error) {
      const errorMessage = error.message;
      this.setState({ errorMsg: errorMessage });
    }
  }

  constructor(props) {
    super(props);
    this.googleSignOut = this.googleSignOut.bind(this);
    this.googleSignIn = this.googleSignIn.bind(this);

    this.state = {
      user: null,
      isSign: false,
      errorMsg: null
    };
  }

  render() {
    return (
      <div class="container-fluid">
        {this.state.errorMsg !== null ? (
          this.state.errorMsg
        ) : this.state.isSign ? (
          <>
            <Chat onSignOutClickListener={this.googleSignOut} />
          </>
        ) : (
          <SignIn onSignInClick={this.googleSignIn} />
        )}
      </div>
    );
  }
}
export default App;
