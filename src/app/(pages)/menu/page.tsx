'use client';

import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";
import { useState } from "react";

export default function Menu() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [search, setSearch] = useState<string>("");

    return (
        <div className="flex">
            <Navbar />
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
            <div className={`mt-15 flex-1 p-6 transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-16'}`}>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">Search Cuisine</h2>
                    <input
                        type="text"
                        placeholder="Search for a cuisine..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="p-2 border rounded-lg w-full"
                    />
                </div>
            </div>
        </div>
    )
}