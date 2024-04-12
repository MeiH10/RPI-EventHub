import React from 'react';
import ReactDOM from 'react-dom';
import './SignUpModal.css'; // Importing CSS for styles

// SignUpModal component accepts props for showing the modal and toggling its visibility
const SignUpModal = ({ isShowing, toggle }) => {
  // Conditional rendering based on isShowing prop
  return isShowing ? ReactDOM.createPortal(
    // Using React portal to mount modal component to 'body' of the document
    <>
      <div className="modal-overlay" onClick={toggle} />  // Overlay to dim the background and close modal on click
      <div className="modal-content">
        <div className="modal-header">
          <button type="button" className="modal-close-button" onClick={toggle}>
            &times; // Close button with an '×' symbol, closes modal on click
          </button>
        </div>
        <div className="modal-body">
          <h2>Sign Up</h2> // Modal title
          <form> // Form for user input
            <div className="form-group">
              <label htmlFor="first-name">First Name</label>
              <input type="text" id="first-name" name="firstName" required /> // Input for first name
            </div>
            <div className="form-group">
              <label htmlFor="last-name">Last Name</label>
              <input type="text" id="last-name" name="lastName" required /> // Input for last name
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required /> // Input for email
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" required /> // Input for password
            </div>
            <div className="form-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input type="password" id="confirm-password" name="confirmPassword" required /> // Input for confirming password
            </div>
            <button type="submit" className="submit-button">Sign Up</button> // Submission button
          </form>
        </div>
      </div>
    </>,
    document.body // Portal target
  ) : null; // If not showing, render nothing
};

export default SignUpModal; // Exporting SignUpModal component
