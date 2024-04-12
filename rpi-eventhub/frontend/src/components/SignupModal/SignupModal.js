import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

function SignupModal() {
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSignup = async () => {
    const userData = {
      username: username,
      email: email,
      password: password
    };

    try {
      const response = await axios.post('http://localhost:5000/signup', userData);
      console.log('Signup successful:', response.data);
      handleClose(); // Close the modal on successful signup
      // Optionally reset form or handle next steps
    } catch (error) {
      console.error('Signup failed:', error.response ? error.response.data : error.message);
      // Handle errors here, such as displaying a notification to the user
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Sign Up
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Sign Up</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="signupUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="signupEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="signupPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSignup}>
            Sign Up
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default SignupModal;
