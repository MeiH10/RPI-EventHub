import React from 'react';
import ReactDOM from 'react-dom';
import './SignUpModal.css'; // Make sure to create a CSS file for styles

const SignUpModal = ({ isShowing, toggle }) => {
  return isShowing ? ReactDOM.createPortal(
    <>
      <div className="modal-overlay" onClick={toggle} />
      <div className="modal-content">
        <div className="modal-header">
          <button type="button" className="modal-close-button" onClick={toggle}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <h2>Sign Up</h2>
          <form>
            <div className="form-group">
              <label htmlFor="first-name">First Name</label>
              <input type="text" id="first-name" name="firstName" required />
            </div>
            <div className="form-group">
              <label htmlFor="last-name">Last Name</label>
              <input type="text" id="last-name" name="lastName" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" required />
            </div>
            <div className="form-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input type="password" id="confirm-password" name="confirmPassword" required />
            </div>
            <button type="submit" className="submit-button">Sign Up</button>
          </form>
        </div>
      </div>
    </>,
    document.body
  ) : null;
};

export default SignUpModal;
