import React, { useRef, useState } from 'react';
import axios from "axios";
import config from "../../config";
import { useAuth } from "../../context/AuthContext";
import {Bounce, toast, ToastContainer} from "react-toastify";

const OTPVerification = ( email ) => {
    const [digits, setDigits] = useState(['', '', '', '', '', '']);
    const inputsRef = useRef([]);
    const submitRef = useRef(null);
    const { login } = useAuth();

    const handleKeyDown = (index) => (e) => {
        const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'];

        if (!/^[0-9]$/.test(e.key) && !allowedKeys.includes(e.key) && !e.metaKey) {
            e.preventDefault();
        }

        if (e.key === 'Backspace' || e.key === 'Delete') {
            e.preventDefault();
            const newDigits = [...digits];

            if (newDigits[index]) {
                newDigits[index] = '';
                setDigits(newDigits);
                return;
            }

            if (index > 0) {
                newDigits[index - 1] = '';
                setDigits(newDigits);
                inputsRef.current[index - 1].focus();
            }
        }
    };

    const handleInput = (index) => (e) => {
        const value = e.target.value.slice(-1);
        if (/^[0-9]$/.test(value)) {
            const newDigits = [...digits];
            newDigits[index] = value;
            setDigits(newDigits);

            if (index < 5) {
                inputsRef.current[index + 1].focus();
            } else {
                submitRef.current.focus();
            }
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain').replace(/\D/g, '');
        const pastedDigits = text.split('').slice(0, 6);

        if (pastedDigits.length === 6) {
            setDigits(pastedDigits);
            submitRef.current.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otp = digits.join('');
        const rpiEmail = email.email + "@rpi.edu";
        try {
            const response = await axios.post(
                `${config.apiUrl}/verify-email`,
                {email:rpiEmail, verificationCode: otp}
            );

            if (response.status === 200) {
                const { token } = response.data;
                login(token);
                console.log('Verification successful');
                handelRedirect();
            }
        } catch (error) {
            console.error('Verification failed:', error.response ? error.response.data : error.message);
        }
    };

    const handelRedirect = () => {
        toast.success("Verification successful! You will be redirected to homepage.", {
            onClose: () => {
                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
            }
        });
    }

    // Function to resend the verification code
    const resendCode = async () => {
        try {
            const codeResponse = await axios.post(`${config.apiUrl}/send-code`, {type: "reset", email: email+"@rpi.edu"});
            if (codeResponse.status === 200) {
                toast.success("Verification code sent to your email.");
            }
        }catch (error) {
            console.error("Error:", error);
            toast.error("Bad Request: " + error.response?.data?.message || "Bad Request: " + error.response?.data?.error);
        }
    }


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center">
            <ToastContainer
                position="top-right"
                style={{ top: '70px' }}
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                transition={Bounce}
            />
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95%] sm:w-full max-w-md mx-auto text-center bg-white p-4 sm:px-8 sm:py-10 rounded-xl shadow font-sans">
                <header className="mb-8 sm:mb-8">
                    <h1 className="text-2xl font-bold mb-1">Email Verification</h1>
                    <p className="text-[15px] text-slate-500">
                        Enter the 6-digit verification code that was sent to email.
                    </p>
                </header>

                <form onSubmit={handleSubmit}>
                    <div className="flex items-center justify-center gap-2 sm:gap-3">
                        {digits.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputsRef.current[index] = el)}
                                type="text"
                                value={digit}
                                className="w-10 h-10 sm:w-14 sm:h-14 overflow-visible text-center text-lg sm:text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-1 sm:p-2 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                maxLength="1"
                                autoComplete="one-time-code"
                                onKeyDown={handleKeyDown(index)}
                                onInput={handleInput(index)}
                                onPaste={handlePaste}
                                onFocus={(e) => e.target.select()}
                            />
                        ))}
                    </div>

                    <div className="max-w-[260px] mx-auto mt-4">
                        <button
                            ref={submitRef}
                            type="submit"
                            className="w-full inline-flex justify-center whitespace-nowrap rounded-lg bg-indigo-500 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-950/10 hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 transition-colors duration-150"
                        >
                            Verify Account
                        </button>
                    </div>
                </form>

                <div className="text-sm text-slate-500 mt-4">
                    Didn't receive code?{' '}
                    <a href="#" className="font-medium text-indigo-500 hover:text-indigo-600"
                        onClick={resendCode}
                    >
                        Resend
                    </a>
                </div>
            </div>
        </div>
    );
};

export default OTPVerification;