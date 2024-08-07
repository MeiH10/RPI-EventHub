import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import config from '../../config';

function LoginModal() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();  // Destructure the login function from useAuth
  const [error, setError] = useState('');


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleLogin = async (e) => {
    e.preventDefault();
    if(isSubmitting) {
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
      handleClose(); // Close the modal on successful login
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data : error.message);
      const errorMessage = error.response ? error.response.data.message || error.response.data : error.message;
      setError(errorMessage);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (show) {
      setIsSubmitting(false);
    }
  }, [show]);


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
        {error && <Alert variant="danger">{error}</Alert>}
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
    </>
  );
}

export default LoginModal;
