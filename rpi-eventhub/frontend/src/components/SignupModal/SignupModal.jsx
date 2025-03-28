import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import config from '../../config';
import styles from './SignupModal.module.css';
import { useColorScheme } from '../../hooks/useColorScheme';

function SignupModal() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const { isDark } = useColorScheme();

  // Email Verification Countdown
  const [countdown, setCountdown] = useState(0);

  const handleClose = () => {
    setShow(false);
    setError('');
    setShowVerification(false);
    setVerificationCode('');
  };

  const handleShow = () => setShow(true);

  const handleInitialSignup = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Validate inputs
    if (!email || !password || !username) {
      setError('Please fill in all fields.');
      setIsSubmitting(false);
      return;
    }
    if (!verifyEmail(email)) {
      setError('Please enter a valid RPI email');
      setIsSubmitting(false);
      return;
    }
    if (!verifyPassword(password)) {
      setError('Password does not meet requirements');
      setIsSubmitting(false);
      return;
    }
    if (!verifyUsername(username)) {
      setError('Username should contain only letters and numbers');
      setIsSubmitting(false);
      return;
    }
    if (!acceptedTerms) {
      setError('You must accept the terms of service.');
      setIsSubmitting(false);
      return;
    }

    const user = { email, password, username };

    try {
      const response = await axios.post(`${config.apiUrl}/signup`, user);
      console.log('Initial signup successful');
      setShowVerification(true);
      // Start countdown
      setCountdown(60);
      setError('');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      setCountdown(Math.ceil(error.response.data.retryAfter / 1000));
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Countdown effect
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleVerification = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${config.apiUrl}/verify-email`, {
        email,
        verificationCode
      });

      if (response.status === 200) {
        login(response.data.token);
        localStorage.setItem('token', response.data.token);
        handleClose();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <Modal.Title className={styles.modalTitle}>
            {showVerification ? 'Verify Your Email' : 'Join RPI Event Hub!'}
          </Modal.Title>
          {!showVerification && <small>All RPI events in one place.</small>}
        </Modal.Header>
        <Modal.Body className={styles.modalBody}>
          {error && (
            <Alert variant="danger" className={styles.alertDanger}>
              <span className={styles.errorText} style={{ color: isDark ? 'white' : '#721c24' }}>
                {error}
              </span>
            </Alert>
          )}
          
          {!showVerification ? (
            <Form onSubmit={handleInitialSignup}>
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
                    I agree to the <a href="/terms-of-service" target="_blank" rel="noreferrer">Terms of Service.</a>
                  </label>
                </div>
              </Form.Group>
            </Form>
          ) : (
            <Form onSubmit={handleVerification}>
              <Form.Group controlId="verificationCode" className={styles.formGroup}>
                <Form.Label className={styles.formLabel}>
                  Enter the verification code sent to your email
                  <small className={styles.smallText}>
                    (Check your spam folder if you don't see it)
                  </small>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter verification code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className={styles.formControl}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer className={styles.modalFooter}>
          <Button variant="secondary" onClick={handleClose} className={`${styles.button} ${styles.buttonSecondary}`}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={showVerification ? handleVerification : handleInitialSignup}
            disabled={isSubmitting}
            className={`${styles.button} ${styles.buttonPrimary}`}
          >
            {showVerification ? 'Verify' : 'Sign Up'}
          </Button>
          {showVerification &&
              (
                <Button
                  variant="success"
                  className={`${styles.button}`}
                  onClick={handleInitialSignup}
                  disabled={countdown > 0}
                >
                  {countdown > 0 ? `Resend Code (${countdown}s)` : 'Resend Code'}
                </Button>
              )
          }
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default SignupModal;