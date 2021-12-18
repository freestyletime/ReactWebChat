import React, { Component } from "react";
import { auth } from "./firebaseConfig";

class SignOut extends Component {
  render() {
    const googleSignOut = this.props.onSignOutClick;
    const user = auth.currentUser;
    return (
      <div class="text-center">
        <div class="container mt-3">
          <div class="row">
            <div class="col-sm">
              Current User:&nbsp;&nbsp;
              <strong>{user.displayName}</strong>
            </div>
            <div class="col-sm">
              <div class="d-grid">
                <button
                  class="btn btn-warning"
                  type="button"
                  onClick={googleSignOut}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SignOut;
