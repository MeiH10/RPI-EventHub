import React, { useState } from "react";
import EventHubLogo from "../../assets/EventHubLogo2.png";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../config";
import {useAuth} from "../../context/AuthContext";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Format email with @rpi.edu if not included
            const fullEmail = email.includes("@") ? email : `${email}@rpi.edu`;

            const response = await axios.post(`${config.apiUrl}/login`, {
                email: fullEmail,
                password: password
            });

            const { token } = response.data;
            //login and store token in localStorage
            login(token);
            // Redirect to homepage or dashboard
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-full justify-center items-center">
            <div className="z-10 bg-white/30 backdrop-blur-md rounded-3 h-max w-full md:w-2/4 mt-10 flex-col justify-center items-center px-4 py-8 md:px-6 md:py-12 lg:px-8 font-sans">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm justify-content-center items-center">
                    <NavLink to="/">
                        <img
                            alt="EventHub Logo"
                            src={EventHubLogo}
                            className="mx-auto h-20 w-auto hover:cursor-pointer"
                        />
                    </NavLink>
                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                        Sign in to your account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    {error && (
                        <div className="mb-4 p-2 text-sm text-red-800 bg-red-100 rounded-md">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
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
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                                    Password
                                </label>
                                <div className="text-sm">
                                    <a href="/forget-password" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                        Forgot password?
                                    </a>
                                </div>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`flex w-full justify-center rounded-md ${loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-500'} px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                            >
                                {loading ? "Signing in..." : "Sign in"}
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm/6 text-gray-500">
                        Not a member?{' '}
                        <a href="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500">
                            Sign up now
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}