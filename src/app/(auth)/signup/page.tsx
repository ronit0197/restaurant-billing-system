'use client';

import { useState, useRef, FormEvent } from 'react';

export default function LoginPage() {
    const [phone, setPhone] = useState<string>('');
    const [otp, setOtp] = useState<string[]>(['', '', '', '']);
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const otpInputs = useRef<(HTMLInputElement | null)[]>([]);

    const handlePhoneSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log("Phone submitted: ", phone);
        setStep('otp');
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^[0-9]?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move to next input if value is entered
        if (value && index < 3 && otpInputs.current[index + 1]) {
            otpInputs.current[index + 1]?.focus();
        }
    };

    const handleOtpSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log("OTP entered: ", otp.join(''));
        // Verify OTP logic here
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-700 to-sky-400">
            <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg m-5 sm:m-0">
                <h2 className="text-2xl font-bold text-gray-800 text-center">New Here!</h2>
                <p className="text-gray-500 text-center mb-6">Create an account</p>

                {step === 'phone' ? (
                    <form onSubmit={handlePhoneSubmit}>
                        <div className="mb-4">
                            <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-sky-500">
                                <span className="px-3 text-gray-700">+91</span>
                                <input
                                    type="text"
                                    id="phone"
                                    className="text-black w-full p-3 focus:outline-none"
                                    placeholder="Enter your phone number"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-sky-500 text-white py-3 rounded-lg hover:bg-sky-600 transition duration-300">Send OTP</button>
                    </form>
                ) : (
                    <form onSubmit={handleOtpSubmit}>
                        <div className="mb-4">
                            <div className="flex justify-between pb-3">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => {
                                            otpInputs.current[index] = el;
                                        }}
                                        type="text"
                                        className="w-14 h-14 text-center text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        maxLength={1}
                                    />
                                ))}
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-sky-500 text-white py-3 rounded-lg hover:bg-sky-600 transition duration-300">Verify OTP</button>
                    </form>
                )}

                <p className="text-gray-600 text-center mt-4">Didn't receive OTP? <a href="#" className="text-sky-500 hover:underline">Resend</a></p>
            </div>
        </div>
    );
}