import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import config from '../../config';
import ForgotPasswordModal from '../ForgotPasswordModal/ForgotPasswordModal'; // Correct import statement




function LoginModal() {
const [show, setShow] = useState(false);
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [isSubmitting, setIsSubmitting] = useState(false);
const [showForgotPassword, setShowForgotPassword] = useState(false); // State to manage Forgot Password modal
const { login } = useAuth();




const handleClose = () => setShow(false);
const handleShow = () => setShow(true);




const handleLogin = async (e) => {
  e.preventDefault();
  if (isSubmitting) {
    return;
  }
  setIsSubmitting(true);




  const credentials = {
    email: email,
    password: password
  };




  try {
    const response = await axios.post(`${config.apiUrl}/login`, credentials);
    console.log('Login successful');
    login(response.data.token);
    handleClose();
  } catch (error) {
    console.error('Login failed:', error.response ? error.response.data : error.message);
  } finally {
    setIsSubmitting(false);
  }
};




const handleShowForgotPassword = () => {
  handleClose();
  setShowForgotPassword(true);
};




return (
  <>
    <Button variant="primary" onClick={handleShow}>
      Log In
    </Button>




    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Log In</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="loginEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>




          <Form.Group controlId="loginPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>




          <Form.Text className="text-muted">
            <a href="#!" onClick={handleShowForgotPassword}>Forgot Password?</a>
          </Form.Text>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleLogin} disabled={isSubmitting}>
          Log In
        </Button>
      </Modal.Footer>
    </Modal>




    <ForgotPasswordModal
      show={showForgotPassword}
      onHide={() => setShowForgotPassword(false)}
    />
  </>
);
}




export default LoginModal;
