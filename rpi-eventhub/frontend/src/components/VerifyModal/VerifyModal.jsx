import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import jwtDecode from 'jwt-decode';
import config from '../../config';

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
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-200"
          onClick={handleShow}
        >
          Verify Email
        </button>
      )}

      {show && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Verify Email</h2>
              <button
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-500"
                onClick={handleClose}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleVerify}>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="verificationCode">
                  Verification Code (check for email from rpieventhub@gmail.com, and check your spam folder!)
                </label>
                <input
                  type="text"
                  id="verificationCode"
                  className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  placeholder="Enter verification code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-200"
                  onClick={handleClose}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-200"
                  disabled={isSubmitting}
                >
                  Verify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default VerifyModal;