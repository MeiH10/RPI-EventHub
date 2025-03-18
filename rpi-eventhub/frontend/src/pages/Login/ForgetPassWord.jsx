import React, {useEffect, useState} from "react";
import EventHubLogo from "../../assets/EventHubLogo2.png";
import {NavLink} from "react-router-dom";
import axios from "axios";
import {Bounce, toast, ToastContainer} from "react-toastify";
import config from "../../config";

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

function ForgetPassWord() {
    const [currentStep, setCurrentStep] = useState(0);
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        if (countdown <= 0) return;
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [countdown]);

    const steps = ["Verify Email", "Enter Code", "New Password"];

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
                    console.log(email+"@rpi.edu");
                    const response = await axios.post(`${config.apiUrl}/check-user-exists`, {email: email+"@rpi.edu"});
                    if (response.status === 200) {
                        const codeResponse = await axios.post(`${config.apiUrl}/send-code`, {email: email+"@rpi.edu"});
                        if (codeResponse.status === 200) {
                            toast.success("Verification code sent to your email.");
                            setCurrentStep(1);
                        }
                    }
                }catch (error) {
                    console.error("Error:", error);
                    toast.error("Bad Request: " + error.response?.data?.error);
                    setLoading(false);
                    return;
                }
                break;
            case 1:
                // Handle code verification
                console.log("Code:", code);
                setCurrentStep(2);
                break;
            case 2:
                // Handle password reset
                console.log("New Password:", password);
                break;
            default:

                console.error("Invalid step");
        }

        setLoading(false);
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
                <div className="bg-white/30 backdrop-blur-lg rounded-3 h-max w-2/4 mt-10 flex-col justify-center items-center px-6 py-12 lg:px-8 font-sans">
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
                                            type="email"
                                            required
                                            onChange={(e) => setEmail(e.target.value)}
                                            autoComplete="email"
                                            className="block w-full rounded-md bg-white px-3 py-1.5 pr-20 text-base text-gray-900
                outline outline-1 outline-gray-300 placeholder:text-gray-400
                focus:outline-2 focus:outline-indigo-600 sm:text-sm/6
                hover:outline-gray-400 transition-all"
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <span className="text-gray-500 text-sm bg-white pl-2">@rpi.edu</span>
                                        </div>
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
                                            onClick={() => setCountdown(60)}
                                        >
                                            {countdown > 0 ? `Resend Code (${countdown}s)` : 'Resend Code'}
                                        </button>
                                    </div>

                                </div>
                            }

                            {
                                currentStep === 2 &&
                                <div>
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                                            New Password
                                        </label>
                                    </div>
                                    <div className="mt-2">
                                        <input
                                            id="new-password"
                                            name="new-password"
                                            type="new-password"
                                            required
                                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                        />
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between">
                                            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                                                Confirm New Password
                                            </label>
                                        </div>
                                        <div className="mt-2">
                                            <input
                                                id="confirm-new-password"
                                                name="confirm-new-password"
                                                type="confirm-new-password"
                                                required
                                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                            />
                                        </div>
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
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgetPassWord;