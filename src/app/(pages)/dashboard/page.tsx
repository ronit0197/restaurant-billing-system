'use client';

import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";
import { useState } from "react";

export default function Dashboard() {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <div className="flex">
            <Navbar />
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
            <div className={`mt-15 flex-1 p-6 transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-16'}`}>
                <h1>Dashboard</h1>
            </div>
        </div>
    )
}   