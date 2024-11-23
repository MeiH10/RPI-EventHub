import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import {jwtDecode} from 'jwt-decode';
import config from '../../config';
import styles from './VerifyModal.module.css';

function VerifyModal() {
  const [show, setShow] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const { isLoggedIn, login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      setIsSubmitting(false);
      return;
    }

    const decodedToken = jwtDecode(token);
    const email = decodedToken.email;

    try {
      const response = await axios.post(
        `${config.apiUrl}/verify-email`,
        { email, verificationCode },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const newToken = response.data.token;

        login(newToken);
        localStorage.setItem('token', newToken);

        handleClose();
      }
    } catch (error) {
      console.error('Verification failed:', error.response ? error.response.data : error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isLoggedIn && (
        <Button variant="warning" onClick={handleShow}>
          Verify Email
        </Button>
      )}

      <Modal className={styles.modalContainer} show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header className={styles.modalHeader} closeButton>
          <Modal.Title className={styles.modalTitle}>Verify Email</Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.modalBody}>
          <Form onSubmit={handleVerify}>
            <Form.Group controlId="verificationCode" className={styles.formGroup}>
              <Form.Label className={styles.formLabel}>Verification Code (check for email from rpieventhub@gmail.com, and check your spam folder!)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter verification code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className={styles.formControl}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className={styles.modalFooter}>
          <Button variant="secondary" onClick={handleClose} className={`${styles.button} ${styles.buttonSecondary}`}>
            Close
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting} 
                    className={`${styles.button} ${styles.buttonPrimary}`}>
            {isSubmitting ? 'Verifying...' : 'Verify'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default VerifyModal;
