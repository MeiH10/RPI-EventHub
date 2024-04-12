import React from "react";
import ReactDOM from "react-dom";
import "./LoginModal.css"; // Importing CSS for styles

// LoginModal component accepts props for controlling its visibility and toggle function
const LoginModal = ({ isShowing, toggle }) => {
  // Conditionally render the modal based on isShowing prop
  return isShowing
    ? ReactDOM.createPortal(
        <React.Fragment>
          <div className="modal-overlay" onClick={toggle} />  // Overlay that dims background and can be clicked to close the modal
          <div className="modal-content">
            <div className="modal-header">
              <button onClick={toggle} className="modal-close-button">
                &times; // Close button with an '×' symbol to close the modal
              </button>
            </div>
            <div className="modal-body">
              <h2>Login</h2> // Title of the modal
              <form> // Form for login
                <input type="text" placeholder="Email" required /> // Input for email
                <input type="password" placeholder="Password" required /> // Input for password
                <button type="submit">Log In</button> // Button to submit the form
              </form>
            </div>
          </div>
        </React.Fragment>,
        document.body // Mounting modal content directly to the body using a React portal
      )
    : null; // Render nothing if isShowing is false
};

export default LoginModal; // Export the component
