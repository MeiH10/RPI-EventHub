import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';




function VerifyModal() {
  const [show, setShow] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const { emailVerified, setEmailVerified } = useAuth();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleVerify = async () => {
    try {
      const response = await axios.post('http://localhost:5000/verify-email', {
        verificationCode
      });
      console.log('Verification successful:', response.data);
      setEmailVerified(true);
      handleClose();
    } catch (error) {
      console.error('Verification failed:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow} disabled={emailVerified}>
        Verify Email
      </Button>

      <Modal show={show} onHide={handleClose}>
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
