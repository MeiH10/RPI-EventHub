import React, {useEffect, useState} from "react";
import EventHubLogo from "../../assets/EventHubLogo2.png";
import OptVerification from "./OptVerification";
import axios from "axios";
import config from "../../config";
import {useAuth} from "../../context/AuthContext";
import {Bounce, toast, ToastContainer} from "react-toastify";
import {NavLink} from "react-router-dom";
import Tooltip from "../../components/Tooltip/Tooltip";

export default function Signup() {
    // form information
    const [email, setEmail] = useState("");
    const [emailTouched, setEmailTouched] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordTouched, setPasswordTouched] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
    const [termsOfService, setTermsOfService] = useState(false);
    const [username, setUsername] = useState("");
    const [usernameTouched, setUsernameTouched] = useState(false);

    const [isPasswordShow, setIsPasswordShow] = useState(false);

    // component show
    const [verificationButtonShow, setVerificationButtonShow] = useState(false);


    /**
     * Validate email, the email can only be an RPI email ending in @rpi.edu
     * @param email
     * @returns {boolean} - true if email is valid, false otherwise
     */
    const verifyEmail = (email) => {
        const pattern = /^[a-zA-Z0-9._%+-]+@rpi.edu$/;
        return pattern.test(email + "@rpi.edu");
    }

    /**
     * Validate username, the username must be at least 3 characters long, only contain letters and numbers
     */
    const verifyUsername = (username) => {
        const pattern = /^[a-zA-Z0-9]{3,}$/;
        return pattern.test(username);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        // validate the email and password
        if (!verifyEmail(email) || !verifyPassword(password) || !verifyConfirmPassword(confirmPassword) || !termsOfService) {
            return;
        }

        // add @rpi.edu to the email
        const rpiEmail = email + "@rpi.edu";

        const user = { email:rpiEmail, password, username };

        try {
            const response = await axios.post(`${config.apiUrl}/signup`, user);
            toast.success("Sign up successful, please check your email for verification.");
            setVerificationButtonShow(true);
        } catch (error) {
            console.error(error);
            toast.error("Error signing up, " + error.response.data.message);
        }
    };


    return (
        <div className="flex min-h-full justify-center items-center">
            <div className="z-10 bg-white/30 backdrop-blur-md rounded-3 h-max w-full md:w-2/4 mt-10 flex-col justify-center items-center px-4 py-8 md:px-6 md:py-12 lg:px-8 font-sans">
                <div className="w-full px-4 md:px-0 sm:mx-auto sm:w-full sm:max-w-sm justify-content-center items-center">
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
                        Join RPI EventHub!
                    </h2>
                    <h4 className="mt-2 text-center text-sm/6 text-gray-500">
                        All Events in One Place
                    </h4>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form action="#" method="POST" className="space-y-6">
                        <div>
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
                            <small className="text-red-500 text-sm">
                                {emailTouched && !verifyEmail(email) && "Please enter a valid RPI email address"}
                            </small>
                        </div>

                        <div>
                            <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                                Username
                            </label>
                            <div className="mt-2 relative">
                                <div className="flex items-center" data-tip="hello">
                                    <input
                                        id="username"
                                        name="username"
                                        type="username"
                                        value={username}
                                        onChange={(e) => {setUsername(e.target.value); setUsernameTouched(true)}}
                                        required
                                        autoComplete="username"
                                        className="block w-full rounded-md bg-white px-3 py-1.5 pr-20 text-base text-gray-900
                                                    outline outline-1 outline-gray-300 placeholder:text-gray-400
                                                    focus:outline-2 focus:outline-indigo-600 sm:text-sm/6
                                                    hover:outline-gray-400 transition-all"
                                    />
                                </div>
                            </div>
                            <small className="text-red-500 text-sm">
                                {usernameTouched && !(verifyUsername(username)) && "Username must be at least 3 characters long, only contain letters and numbers"}
                            </small>
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
                        <p className="mt-2 flex justify-content-center items-center text-center text-sm/6 text-gray-900">
                            <input
                                id="terms-of-service"
                                name="terms-of-service"
                                type="checkbox"
                                checked={termsOfService}
                                required
                                onChange={(e) => setTermsOfService(e.target.checked)}
                                className="appearance-none h-5 w-5 border-2 border-gray-600 rounded-full
                                             checked:bg-indigo-600
                                             focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                                             transition-colors duration-200 cursor-pointer mr-2"
                            />
                            I agree to the
                            <a href="/terms-of-service" className="ml-1 font-semibold text-indigo-600 hover:text-indigo-500">
                                Terms of Service.
                            </a>
                        </p>
                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                onClick={handleSubmit}
                            >
                                {verificationButtonShow ? "Sign Up" : "Continue"}
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm/6 text-gray-500">
                        Already have an account? {' '}
                        <a href="/login"
                           className="font-semibold text-indigo-600 hover:text-indigo-500"
                        >
                            Sign in here
                        </a>
                    </p>

                </div>
            </div>
            {
                verificationButtonShow && (
                    <OptVerification email = {email}/>
                )
            }
        </div>
    );
}



