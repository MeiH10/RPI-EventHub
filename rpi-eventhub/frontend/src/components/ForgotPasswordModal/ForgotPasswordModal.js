import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import config from '../../config';




function ForgotPasswordModal({ show, onHide }) {
const [email, setEmail] = useState('');
const [isSubmitting, setIsSubmitting] = useState(false);
const [message, setMessage] = useState('');




const handleResetPassword = async (e) => {
  e.preventDefault();
  if (isSubmitting) {
    return;
  }
  setIsSubmitting(true);




  try {
    const response = await axios.post(`${config.apiUrl}/forgot-password`, { email });
    setMessage('Password reset link sent to your email.');
  } catch (error) {
    setMessage('Failed to send password reset link. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};




return (
  <Modal
    show={show}
    onHide={onHide}
    backdrop="static"
    keyboard={false}
  >
    <Modal.Header closeButton>
      <Modal.Title>Forgot Password</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form onSubmit={handleResetPassword}>
        <Form.Group controlId="forgotPasswordEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        {message && <p>{message}</p>}
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onHide}>
        Close
      </Button>
      <Button variant="primary" onClick={handleResetPassword} disabled={isSubmitting}>
        Send Reset Link
      </Button>
    </Modal.Footer>
  </Modal>
);
}




export default ForgotPasswordModal;
