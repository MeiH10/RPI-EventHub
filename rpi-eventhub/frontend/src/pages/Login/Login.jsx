import React from "react";
import EventHubLogo from "../../assets/EventHubLogo2.png";
import {NavLink} from "react-router-dom";

export default function Login() {



    return (
        <div className="flex min-h-full justify-center items-center">
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
                        Sign in to your account
                    </h2>
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
                                        type="email"
                                        required
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
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Sign in
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