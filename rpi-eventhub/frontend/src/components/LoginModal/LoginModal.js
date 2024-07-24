import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import config from '../../config'; // Adjust path if necessary

function LoginModal() {
  const [showLogin, setShowLogin] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, forgotPassword } = useAuth();

  const handleCloseLogin = () => setShowLogin(false);
  const handleShowLogin = () => setShowLogin(true);

  const handleCloseForgotPassword = () => setShowForgotPassword(false);
  const handleShowForgotPassword = () => {
    setShowLogin(false);
    setShowForgotPassword(true);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${config.apiUrl}/auth/login`, { email, password });
      login(response.data.token);
      handleCloseLogin();
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data : error.message);
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);

    try {
      await forgotPassword(email);
      handleCloseForgotPassword();
    } catch (error) {
      console.error('Failed to send password reset email:', error.response ? error.response.data : error.message);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShowLogin}>
        Log In
      </Button>

      <Modal show={showLogin} onHide={handleCloseLogin} backdrop="static" keyboard={false}>
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
              <Button variant="link" onClick={handleShowForgotPassword} style={{ padding: 0 }}>
                Forgot Password?
              </Button>
            </Form.Text>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseLogin}>
            Close
          </Button>
          <Button variant="primary" onClick={handleLogin} disabled={isSubmitting}>
            Log In
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showForgotPassword} onHide={handleCloseForgotPassword} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Forgot Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleForgotPassword}>
            <Form.Group controlId="forgotPasswordEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseForgotPassword}>
            Close
          </Button>
          <Button variant="primary" onClick={handleForgotPassword} disabled={isSubmitting}>
            Send Reset Link
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default LoginModal;
