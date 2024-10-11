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
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

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

  function verifyUsername(username) {
    const pattern = /^[a-zA-Z0-9]*$/;
    return pattern.test(username);
  }

  const verifyEmail = (email) => {
    const pattern = /^[a-zA-Z0-9._%+-]+@rpi.edu$/;
    return pattern.test(email);
  }



  const verifyPassword = (password) => {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;
    return pattern.test(password);
  };
  

  return (
      <>
        <Button variant="secondary" onClick={handleShow}>
          Sign Up
        </Button>

        <Modal className={styles.modalContainer} show={show} onHide={handleClose} backdrop="static" keyboard={false}>
          <Modal.Header className={styles.modalHeader}>
            <Modal.Title className={styles.modalTitle}>Join RPI Event Hub!</Modal.Title>
            <small>All RPI events in one place.</small>
          </Modal.Header>
          <Modal.Body className={styles.modalBody}>
            {error && <Alert variant="danger" className={styles.alertDanger}>{error}</Alert>}
            <Form>
              <Form.Group controlId="signupUsername" className={styles.formGroup}>
                <Form.Label className={styles.formLabel}>Username</Form.Label>
                <div className={styles.inputField}>
                  <i className="bi bi-people-fill"></i>
                  <Form.Control
                      type="text"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => { setUsername(e.target.value); setUsernameTouched(true); }}
                      className={styles.formControl}
                  />
                </div>
                {usernameTouched && !verifyUsername(username) && (
                    <small
                        style={{
                          color: 'red',
                          fontSize: '0.8rem',
                          marginTop: '0.2rem',
                          marginBottom: '0',
                        }}
                    >
                      Username should contain only letters and numbers
                    </small>
                )}
              </Form.Group>
              <Form.Group controlId="signupEmail" className={styles.formGroup}>
                <Form.Label className={styles.formLabel}>Email address</Form.Label>
                <div className={styles.inputField}>
                  <i className="bi bi-envelope-fill"></i>
                  <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setEmailTouched(true); }}
                      className={styles.formControl}
                  />
                </div>
                {emailTouched && !verifyEmail(email) && (
                    <small
                        style={{
                          color: 'red',
                          fontSize: '0.8rem',
                          marginTop: '0.2rem',
                          marginBottom: '0',
                        }}
                    >
                      Please enter an RPI email
                    </small>
                )}
              </Form.Group>
              <Form.Group controlId="signupPassword" className={styles.formGroup}>
                <Form.Label className={styles.formLabel}>Password</Form.Label>
                <div className={styles.inputField}>
                  <i className="bi bi-key-fill"></i>
                  <Form.Control
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setPasswordTouched(true); }}
                      className={styles.formControl}
                  />
                </div>
                {passwordTouched && !verifyPassword(password) && (
                    <small
                        style={{
                          color: 'red',
                          fontSize: '0.8rem',
                          marginTop: '0.2rem',
                          marginBottom: '0',
                        }}
                    >
                      Password should contain at least one uppercase letter, one lowercase letter,
                      one number, and at least 8 characters
                    </small>
                )}
              </Form.Group>
              <Form.Group controlId="termsOfService" className={styles.formGroup}>

                <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '0.5rem',
                    }}
                >
                  <input
                      id={'termsOfService'}
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                  />
                  <label htmlFor={'termsOfService'} className={styles.formLabel} style={{marginLeft:"10px"}}>
                    I agree to the <a href="/terms" target="_blank" rel="noreferrer">Terms of Service.</a>
                  </label>
                </div>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer className={styles.modalFooter}>
            <Button variant="secondary" onClick={handleClose} className={`${styles.button} ${styles.buttonSecondary}`}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSignup} disabled={isSubmitting}
                    className={`${styles.button} ${styles.buttonPrimary}`}>
              Sign Up
            </Button>
          </Modal.Footer>
        </Modal>
      </>
  );
}

export default SignupModal;