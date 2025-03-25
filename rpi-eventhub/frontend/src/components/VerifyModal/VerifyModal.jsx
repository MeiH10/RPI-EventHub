import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import {jwtDecode} from 'jwt-decode';
import config from '../../config';

const BANNED = 0;
const UNVERIFIED = 1;
const VERIFIED = 2;
const OFFICER = 3;
const ADMIN = 4;

function VerifyModal() {
  const [show, setShow] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const { isLoggedIn, login, role } = useAuth();
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

        localStorage.setItem('token', newToken);
        login(newToken);


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
      {isLoggedIn && role < VERIFIED && (
        <Button variant="warning" onClick={handleShow}>
          Verify Email
        </Button>
      )}

      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Verify Email</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleVerify}>
            <Form.Group controlId="verificationCode">
              <Form.Label>Verification Code (check for email from rpieventhub@gmail.com, and check your spam folder!)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter verification code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" type="submit" onClick={handleVerify} disabled={isSubmitting}>
            Verify
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default VerifyModal;
