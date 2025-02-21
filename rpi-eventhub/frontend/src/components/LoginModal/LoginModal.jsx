import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import config from '../../config';
import styles from './LoginModal.module.css';
import { useColorScheme } from '../../hooks/useColorScheme';
function LoginModal({ show, setShow }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();  // Destructure the login function from useAuth
  const [error, setError] = useState('');
  const { isDark } = useColorScheme();
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
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        style={{fontFamily: 'Helvetica'}}
      >
        <Modal.Header className={styles.modalHeader}>
          <Modal.Title className={styles.modalTitle}>Log In</Modal.Title>
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
            <Form.Group controlId="loginEmail" className={styles.formGroup}>
              <Form.Label className={styles.formLabel}>Email address</Form.Label>
              <div className={styles.inputField}>
                <i className="bi bi-envelope-fill"></i>
                <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.formControl}
                />
              </div>
            </Form.Group>

            <Form.Group controlId="loginPassword" className={styles.formGroup}>
            <Form.Label className={styles.formLabel}>Password</Form.Label>
              <div className={styles.inputField}>
                <i className="bi bi-key-fill"></i>
                <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.formControl}
                />
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className={styles.modalFooter}>
          <Button variant="secondary" onClick={handleClose} className={`${styles.button} ${styles.buttonSecondary}`}>
            Close
          </Button>
          <Button variant="primary" onClick={handleLogin} disabled={isSubmitting} className={`${styles.button} ${styles.buttonPrimary}`}>
            Log In
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default LoginModal;
