import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import {jwtDecode} from 'jwt-decode';

function VerifyModal() {
  const [show, setShow] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const { isLoggedIn, login } = useAuth();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleVerify = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    const decodedToken = jwtDecode(token);
    const email = decodedToken.email;

    try {

      // console.log(email, verificationCode);


      const response = await axios.post('http://localhost:5000/verify-email', {
        email,
        verificationCode,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        // console.log('Email verified successfully');
        // console.log("response.data: ", response.data);
        const newToken = response.data.token; 
        
        login(newToken);
        handleClose();
      }
    } catch (error) {
      console.error('Verification failed:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <>
      {isLoggedIn && (
        <Button variant="warning" onClick={handleShow}>
          Verify Email
        </Button>
      )}

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Verify Email</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="verificationCode">
              <Form.Label>Verification Code</Form.Label>
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
          <Button variant="primary" onClick={handleVerify}>
            Verify
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default VerifyModal;
