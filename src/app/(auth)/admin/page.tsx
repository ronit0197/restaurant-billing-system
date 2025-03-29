'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        console.log({ email, password });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-rose-500 to-rose-200">
            <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 text-center">Welcome Admin</h2>
                <p className="text-gray-500 text-center mb-6">Login to continue</p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <label className="flex items-center text-gray-600">
                            <input type="checkbox" className="form-checkbox text-rose-500" />
                            <span className="ml-2">Remember me</span>
                        </label>
                    </div>

                    <button type="submit" className="w-full bg-rose-500 text-white py-3 rounded-lg hover:bg-rose-600 transition duration-300">Login</button>
                </form>
            </div>
        </div>
    );
}