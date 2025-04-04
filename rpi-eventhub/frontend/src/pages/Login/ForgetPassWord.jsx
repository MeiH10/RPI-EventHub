import React, {useEffect, useState} from "react";
import EventHubLogo from "../../assets/EventHubLogo2.png";
import {NavLink} from "react-router-dom";
import axios from "axios";
import {Bounce, toast, ToastContainer} from "react-toastify";
import config from "../../config";

function ForgetPassWord() {
    const [currentStep, setCurrentStep] = useState(0);
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isPasswordShow, setIsPasswordShow] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);
    const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        if (countdown <= 0) return;
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [countdown]);

    const steps = ["Verify Email", "New Password"];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (email === "") {
            toast.error("Please enter your email.");
            setLoading(false);
            return;
        }

        switch (currentStep) {
            case 0:
                try {
                    const response = await axios.post(`${config.apiUrl}/check-user-exists`, {email: email+"@rpi.edu"});
                    if (response.status === 200) {
                        const codeResponse = await axios.post(`${config.apiUrl}/send-code`, {type: "reset", email: email+"@rpi.edu"});
                        if (codeResponse.status === 200) {
                            toast.success("Verification code sent to your email.");
                            setCurrentStep(1);
                        }
                    }
                }catch (error) {
                    console.error("Error:", error);
                    toast.error("Bad Request: " + error.response?.data?.message || "Bad Request: " + error.response?.data?.error);
                    setLoading(false);
                    return;
                }
                break;
            case 1:
                // Handle code verification
                try {
                    console.log(code)
                    const response = await axios.post
                    (`${config.apiUrl}/reset-password`,
                        {
                            email: email+"@rpi.edu",
                            password: password,
                            verificationCode: code
                        });
                    if (response.status === 200) {
                        toast.success("Password reset successfully.");
                        handelRedirect();
                    }
                }catch (error) {
                    console.error("Error:", error);
                    toast.error("" + error.response?.data?.message || "Bad Request: " + error.response?.data?.error);
                    setLoading(false);
                    return;
                }
                break;
            default:
                console.error("Invalid step");
        }

        setLoading(false);
    }

    // Function to resend the verification code
    const resendCode = async () => {
        try {
            const codeResponse = await axios.post(`${config.apiUrl}/send-code`, {type: "reset", email: email+"@rpi.edu"});
            if (codeResponse.status === 200) {
                toast.success("Verification code sent to your email.");
                setCountdown(60);
            }
        }catch (error) {
            console.error("Error:", error);
            toast.error("Bad Request: " + error.response?.data?.message || "Bad Request: " + error.response?.data?.error);
        }
    }

    const handelRedirect = () => {
        toast.success("ResetPassword successful! You will be redirected to homepage.", {
            onClose: () => {
                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
            }
        });
    }



    /**
     * Validate password, the password must be at least 8 characters long,
     * contain at least one uppercase letter,
     * at least one lowercase letter, and at least one number.
     * @param password
     * @returns {boolean} - true if password is valid, false otherwise
     */
    const verifyPassword = (password) => {
        const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        return pattern.test(password);
    }

    /**
     * Validate confirm password, the confirmPassword must match the password
     * @param confirmPassword
     */
    const verifyConfirmPassword = (confirmPassword) => {
        return password === confirmPassword;
    }

    return (
        <div>
            <div className="flex min-h-full justify-center items-center">
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
                <div className="z-10 bg-white/30 backdrop-blur-md rounded-3 h-max w-full md:w-2/4 mt-10 flex-col justify-center items-center px-4 py-8 md:px-6 md:py-12 lg:px-8 font-sans">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm justify-content-center items-center">
                        <NavLink
                            to="/"
                        >
                            <img
                                alt="EventHub Logo"
                                src={EventHubLogo}
                                className="mx-auto h-20 w-auto hover:cursor-pointer"
                            />
                        </NavLink>
                        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                            Reset your password
                        </h2>
                    </div>

                    <Stepper steps={steps} currentStep={currentStep} />

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form action="#" method="POST" className="space-y-6">
                            {currentStep === 0 && <div>
                                <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                                    RPI Email address
                                </label>
                                <div className="mt-2 relative">
                                    <div className="flex items-center">
                                        <input
                                            id="email"
                                            name="email"
                                            type="text"
                                            required
                                            autoComplete="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900
                                                    outline outline-1 outline-gray-300 placeholder:text-gray-400
                                                    focus:outline-2 focus:outline-indigo-600 sm:text-sm/6
                                                    hover:outline-gray-400 transition-all rounded-r-none"
                                        />
                                        <span className="bg-gray-100 text-gray-500 py-1.5 px-2 text-sm sm:text-sm/6 rounded-r-md outline outline-1 outline-gray-300">
                                        @rpi.edu
                                    </span>
                                    </div>
                                </div>
                            </div>}
                            {currentStep === 1 &&
                                <div>
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="confirm-password" className="block text-sm/6 font-medium text-gray-900">
                                            Enter Email Verification Code
                                        </label>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2 ">
                                        <div>
                                            <input
                                                id="verification-code"
                                                name="verification-code"
                                                type="verification-code"
                                                required
                                                onChange={(e) => setCode(e.target.value)}
                                                autoComplete="verification-code"
                                                value={code}
                                                className="block w-max rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                            />
                                        </div>
                                        <button
                                            disabled={countdown > 0}
                                            type="button"
                                            className={`block w-max justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                                                countdown > 0
                                                    ? 'bg-gray-400 cursor-not-allowed opacity-50'
                                                    : 'bg-green-600 hover:bg-green-500 cursor-pointer'
                                            }`}
                                            onClick={() => {setCountdown(60); resendCode();}}

                                        >
                                            {countdown > 0 ? `Resend Code (${countdown}s)` : 'Resend Code'}
                                        </button>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                                                New Password
                                            </label>
                                        </div>
                                        <div className="mt-2 relative">
                                            <div className="flex items-center">
                                                <input
                                                    id="password"
                                                    name="password"
                                                    type={isPasswordShow ? "text" : "password"}
                                                    value={password}
                                                    onChange={(e) => {setPassword(e.target.value) ; setPasswordTouched(true)}}
                                                    required
                                                    autoComplete="current-password"
                                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                                />
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-cursor">
                                                    <button
                                                        type="button"
                                                        className="text-gray-500 text-sm bg-white pl-2 pointer-cursor"
                                                        onClick={() => setIsPasswordShow(!isPasswordShow)}
                                                    >
                                                        {!isPasswordShow ?
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                            </svg>
                                                            : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                            </svg>
                                                        }
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <small className="text-red-500 text-sm">
                                            {passwordTouched && !verifyPassword(password) && "Password must be at least 8 characters long, contain at least one uppercase letter, at least one lowercase letter, and at least one number."}
                                        </small>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between">
                                            <label htmlFor="confirm-password" className="block text-sm/6 font-medium text-gray-900">
                                                Confirm Password
                                            </label>
                                        </div>
                                        <div className="mt-2 flex">
                                            <input
                                                id="confirm-password"
                                                name="confirm-password"
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) =>{setConfirmPassword(e.target.value); setConfirmPasswordTouched(true)}}
                                                required
                                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                            />
                                        </div>
                                        <small className="text-red-500">
                                            {passwordTouched && confirmPasswordTouched && !verifyConfirmPassword(confirmPassword) && "Passwords do not match"}
                                        </small>
                                    </div>
                                </div>
                            }

                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    onClick={handleSubmit}
                                >
                                    Continue
                                </button>
                            </div>
                        </form>
                        <p className="mt-10 text-center text-sm/6 text-gray-500">
                            Recall your password?{' '}
                            <a href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                Login here
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}


const Stepper = ({ steps, currentStep }) => {
    return (
        <div className="mx-auto mb-8 max-w-md">
            <div className="flex justify-between">
                {steps.map((step, index) => (
                    <div key={step} className="flex flex-col items-center w-1/3">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center 
                ${
                                currentStep > index
                                    ? "bg-indigo-600 text-white"
                                    : currentStep === index
                                        ? "bg-indigo-100 text-indigo-600 border-2 border-indigo-600"
                                        : "bg-gray-100 text-gray-500"
                            }`}
                        >
                            {currentStep > index ? (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                index + 1
                            )}
                        </div>
                        <span
                            className={`mt-2 text-xs text-center ${
                                currentStep === index ? "text-indigo-600 font-medium" : "text-gray-500"
                            }`}
                        >
                          {step}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};


export default ForgetPassWord;