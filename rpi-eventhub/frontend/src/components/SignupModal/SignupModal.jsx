import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useColorScheme } from '../../hooks/useColorScheme';
import config from '../../config';
import styles from './SignupModal.module.css';

function SignupModal() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { isDark } = useColorScheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleClose = () => {
    setShow(false);
    setError('');
  };
  const handleShow = () => setShow(true);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);

    if (!email || !password || !username) {
      setError('Please fill in all fields.');
      setIsSubmitting(false);
      return;
    }
    if (!email.endsWith('@rpi.edu')) {
      setError('Please enter an RPI email');
      setIsSubmitting(false);
      return;
    }
    if (!acceptedTerms) {
      setError('You must accept the terms of service.');
      setIsSubmitting(false);
      return;
    }

    const user = {
      email,
      password,
      username
    };

    try {
      const response = await axios.post(`${config.apiUrl}/signup`, user);
      console.log('Signup successful');
      login(response.data.token);
      localStorage.setItem('token', response.data.token);
      handleClose();
    } catch (error) {
      console.error('Signup failed:', error.response ? error.response.data : error.message);
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
      <Button variant="secondary" onClick={handleShow}>
        Sign Up
      </Button>

      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton className={styles.modalHeader}>
          <Modal.Title className={styles.modalTitle}>Sign Up</Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.modalBody}>
        {error && (
    <Alert variant="danger" className={styles.alertDanger}>
        <span
            className={styles.errorText}
            style={{ color: isDark ? 'white' : '#721c24' }}
        >
            {error}
        </span>
    </Alert>
)}
          <Form>
            <Form.Group controlId="signupUsername" className={styles.formGroup}>
              <Form.Label className={styles.formLabel}>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={styles.formControl}
              />
            </Form.Group>
            <Form.Group controlId="signupEmail" className={styles.formGroup}>
              <Form.Label className={styles.formLabel}>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.formControl}
              />
            </Form.Group>
            <Form.Group controlId="signupPassword" className={styles.formGroup}>
              <Form.Label className={styles.formLabel}>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.formControl}
              />
            </Form.Group>
            <Form.Group controlId="termsOfService" className={styles.formGroup}>
              <Form.Check
                type="checkbox"
                className="custom-checkbox"
                label={
                  <span className={styles.acceptText}>
                    I accept the{' '}
                    <a href="/terms-of-service" target="_blank" rel="noopener noreferrer" className={styles.link}>
                      Terms of Service
                    </a>
                    .
                  </span>
                }
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className={styles.modalFooter}>
          <Button variant="secondary" onClick={handleClose} className={`${styles.button} ${styles.buttonSecondary}`}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSignup} disabled={isSubmitting} className={`${styles.button} ${styles.buttonPrimary}`}>
            Sign Up
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default SignupModal;