import React from "react";
import ReactDOM from "react-dom";
import "./LoginModal.css"; // Ensure you have a corresponding CSS file

const LoginModal = ({ isShowing, toggle }) => {
  return isShowing
    ? ReactDOM.createPortal(
        <React.Fragment>
          <div className="modal-overlay" onClick={toggle} />
          <div className="modal-content">
            <div className="modal-header">
              <button onClick={toggle} className="modal-close-button">
                &times;
              </button>
            </div>
            <div className="modal-body">
              <h2>Login</h2>
              <form>
                <input type="text" placeholder="Email" required />
                <input type="password" placeholder="Password" required />
                <button type="submit">Log In</button>
              </form>
            </div>
          </div>
        </React.Fragment>,
        document.body
      )
    : null;
};

export default LoginModal;
