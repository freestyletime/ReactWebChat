import React, { Component } from "react";

/**
 * SignIn Component
 */
class SignIn extends Component {
  render() {
    const googleSignIn = this.props.onSignInClick;

    return (
      <div className="text-center">
        <div className="d-grid">
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={googleSignIn}
          >
            Sign in with google
          </button>
        </div>
      </div>
    );
  }
}

export default SignIn;
