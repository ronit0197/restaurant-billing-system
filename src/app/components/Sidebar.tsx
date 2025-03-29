'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ isOpen, setIsOpen }: { isOpen: any, setIsOpen: any }) {

    const pathname = usePathname();

    return (
        <aside
            className={`fixed top-0 left-0 h-screen bg-rose-500 text-white p-4 transition-all duration-300 flex flex-col ${isOpen ? "w-64" : "w-16"
                }`}
        >
            {/* Toggle Button */}
            <button
                className="absolute top-[50%] right-[-12px] transform -translate-y-1/2 z-50 p-2 bg-rose-600 text-white rounded-full border border-white shadow-lg"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Image
                    src={isOpen ? "/arrow-left.svg" : "/arrow-right.svg"}
                    alt="menu-toggle"
                    height={20}
                    width={20}
                />
            </button>

            {/* Sidebar Menu */}
            <ul className="mt-20 space-y-4">
                <SidebarItem href="/dashboard" icon="/dashboard.svg" label="Dashboard" isOpen={isOpen} active={pathname.includes('/dashboard')} />
                <SidebarItem href="/inventory" icon="/inventory.svg" label="Inventory" isOpen={isOpen} active={pathname.includes('/inventory')} />
                <SidebarItem href="/orders" icon="/orders.svg" label="Orders" isOpen={isOpen} active={pathname.includes('/orders')} />
                <SidebarItem href="/analysis" icon="/analysis.svg" label="Analytics" isOpen={isOpen} active={pathname.includes('/analytics')} />
            </ul>
        </aside>
    );
}

interface SidebarItemProps {
    href: string;
    icon: string;
    label: string;
    isOpen: boolean;
    active: boolean;
}

function SidebarItem({ href, icon, label, isOpen, active }: SidebarItemProps) {
    return (
        <Link href={href} className={`p-2 flex items-center gap-3 rounded-lg cursor-pointer transition ${active ? "bg-rose-300" : "hover:bg-rose-400"
            }`}>
            <Image src={icon} alt={`${label}-icon`} width={24} height={24} />
            <span className={`${isOpen ? "inline" : "hidden"} transition-all`}>{label}</span>
        </Link>
    );
}