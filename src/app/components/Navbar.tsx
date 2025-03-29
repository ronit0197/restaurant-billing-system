'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Navbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <nav className="bg-rose-500 p-4 shadow-md fixed top-0 w-full z-50">
            <div className="container mx-auto flex justify-between items-center relative">
                {/* Logo */}
                <div className="text-white text-xl font-bold">ERP</div>

                {/* User Icon & Dropdown */}
                <div className="relative">
                    <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="focus:outline-none">
                        <Image src="/user-circle-white.svg" alt="User" width={20} height={20} className="rounded-full cursor-pointer" />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-4">
                            <p className="text-gray-800 font-medium">John Doe</p>
                            <p className="text-gray-500 text-sm">john.doe@example.com</p>
                            <hr className="my-2" />
                            <button className="w-full text-center text-white bg-rose-400 hover:bg-rose-500 px-4 py-2 rounded-lg" onClick={() => alert('Logging out...')}>
                                Log out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}