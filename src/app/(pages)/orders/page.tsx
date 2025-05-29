'use client';

import { useRef, useState } from 'react';
import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";
import Invoice from '@/app/components/Invoice';
import Image from 'next/image';
import { useReactToPrint } from 'react-to-print';
import React from 'react';

interface Cuisine {
    id: number;
    name: string;
    price: number;
}

interface OrderItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    addons?: string;
}

interface Order {
    id: number;
    items: OrderItem[];
    total: number;
    date: string;
    status: 'Pending' | 'Delivered' | 'Canceled';
}

const availableCuisines: Cuisine[] = [
    { id: 1, name: "Pizza", price: 200 },
    { id: 2, name: "Burger", price: 100 },
    { id: 3, name: "Pasta", price: 150 },
    { id: 4, name: "Sushi", price: 300 },
    { id: 5, name: "Salad", price: 120 }
];

export default function Orders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([]);
    const [search, setSearch] = useState<string>("");
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const [printOrder, setPrintOrder] = useState<Order | null>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const handleAddCuisine = (cuisine: Cuisine) => {
        const existingOrder = currentOrder.find(order => order.id === cuisine.id);
        if (existingOrder) {
            setCurrentOrder(
                currentOrder.map(order =>
                    order.id === cuisine.id ? { ...order, quantity: order.quantity + 1 } : order
                )
            );
        } else {
            setCurrentOrder([...currentOrder, { ...cuisine, quantity: 1 }]);
        }
    };

    const handleQuantityChange = (id: number, quantity: number) => {
        setCurrentOrder(
            currentOrder.map(order =>
                order.id === id ? { ...order, quantity: quantity < 1 ? 1 : quantity } : order
            )
        );
    };

    const handleAddons = (id: number, addons: string) => {
        setCurrentOrder(
            currentOrder.map(order =>
                order.id === id ? { ...order, addons: addons } : order
            )
        );
    }

    const handleCreateOrder = () => {
        if (currentOrder.length === 0) return;
        const newOrder: Order = {
            id: orders.length + 1,
            items: currentOrder,
            total: currentOrder.reduce((sum, item) => sum + item.price * item.quantity, 0),
            date: new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
            }).format(new Date()),
            status: 'Pending'
        };
        setOrders([...orders, newOrder]);
        setCurrentOrder([]);
    };

    const handleStatusChange = (id: number, status: 'Pending' | 'Delivered' | 'Canceled') => {
        setOrders(
            orders.map(order => (order.id === id ? { ...order, status } : order))
        );
    };

    const handleRemoveItem = (id: number) => {
        setCurrentOrder(currentOrder.filter(order => order.id !== id));
    };

    const totalRevenue = orders
        .filter(order => order.status !== 'Canceled')
        .reduce((sum, order) => sum + order.total, 0);

    const currentOrderTotal = currentOrder.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const reactToPrintFn = useReactToPrint({ contentRef });

    const handlePrint = (order: Order) => {
        console.log("Printing...")
        setPrintOrder(order);
        setTimeout(() => {
            reactToPrintFn();
        }, 100);
    };

    console.log("Current Order:", currentOrder)
    console.log("orders:", orders)

    return (
        <div className="flex">
            <Navbar />
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
            <div className={`mt-15 flex-1 p-6 transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-16'}`}>
                {/* Search Section */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-black text-xl font-semibold mb-2">Search Cuisine</h2>
                    <input
                        type="text"
                        placeholder="Search for a cuisine..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="p-2 border rounded-lg w-full text-black"
                    />
                    <div className="mt-2 max-h-50 overflow-y-auto">
                        {availableCuisines
                            .filter(cuisine => cuisine.name.toLowerCase().includes(search.toLowerCase()))
                            .map(cuisine => (
                                <div key={cuisine.id} className="p-2 border-b flex justify-between items-center">
                                    <span className='text-black'>{cuisine.name} - ₹{cuisine.price}</span>
                                    <button
                                        onClick={() => handleAddCuisine(cuisine)}
                                        className="bg-green-500 text-white px-4 py-1 rounded-lg hover:bg-green-600"
                                    >
                                        Add
                                    </button>
                                </div>
                            ))}
                    </div>
                </div>

                {/* Current Order */}
                <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-black text-xl font-semibold mb-2">Current Order</h2>
                    {currentOrder.map(order => (
                        <div key={order.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b py-2 gap-2">
                            <span className="text-black block text-sm sm:text-base font-medium">{order.name} - ₹{order.price}</span>
                            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                                <input
                                    type="text"
                                    placeholder="Add-ons"
                                    className="text-black p-2 border rounded-lg w-full sm:w-32"
                                    value={order.addons ?? ''}
                                    onChange={(e) => handleAddons(order.id, e.target.value)}
                                />
                                <input
                                    type="number"
                                    value={order.quantity ?? 1}
                                    onChange={(e) => handleQuantityChange(order.id, parseInt(e.target.value))}
                                    className="text-black w-full sm:w-16 p-2 border rounded-lg text-center"
                                />
                                <button
                                    onClick={() => handleRemoveItem(order.id)}
                                    className="p-2 sm:w-9 w-full flex justify-center items-center rounded-lg bg-rose-500 hover:bg-rose-600"
                                >
                                    <Image src="/delete.svg" alt="Delete" width={20} height={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className='w-[100%] flex justify-between items-center'>
                        <button
                            onClick={handleCreateOrder}
                            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                        >
                            Create Order
                        </button>
                        <span className='text-black mt-3 font-semibold'>Total: ₹{currentOrderTotal.toFixed(2)}/-</span>
                    </div>
                </div>

                {/* Total Revenue Section */}
                <div className="mt-6 bg-white p-4 rounded-lg shadow-md text-xl font-semibold text-center sm:text-right">
                    <span className='text-black'>Total Revenue: ₹{totalRevenue.toFixed(2)}/-</span>
                </div>

                {/* Orders List */}
                <div className="mt-6 max-h-300 overflow-y-auto bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-black text-xl font-semibold mb-2">Orders</h2>
                    {orders.slice().reverse().map((order, index) => (
                        <div key={order.id} className="relative p-3 border-b bg-gray-50 mb-3 rounded-lg md:flex md:justify-between md:items-start">
                            <div className="w-full">
                                <p className="text-black font-semibold text-sm sm:text-base flex flex-col sm:flex-row">
                                    <span>Order #{order.id}</span>
                                    <span className="font-normal sm:ml-2">Date: {order.date}</span>
                                </p>
                                <div className="bg-gray-100 p-2 rounded my-2 text-sm sm:text-base flex flex-col sm:flex-row sm:flex-wrap">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="border border-gray-300 rounded p-2 mb-2 mr-0 sm:mr-2">
                                            <p className="text-black">
                                                {`Item${index + 1}:`} {item.name} - ₹{item.price} <span className='font-bold'>Qnt:</span> {item.quantity}
                                            </p>
                                            {item.addons && (
                                                <p className="text-black text-sm">Addons: {item.addons}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <p className="text-black text-sm sm:text-base font-semibold mb-1">Total: ₹{order.total.toFixed(2)}</p>
                                <p className="text-black text-sm sm:text-base">
                                    <span className='font-bold'>Status:</span> <span className={order.status === 'Pending' ? 'text-yellow-500' : order.status === 'Delivered' ? 'text-green-500' : 'text-red-500'}>{order.status}</span>
                                </p>
                            </div>

                            {/* Action Container */}
                            <div className="relative mt-2 md:mt-0 md:w-40 h-24">
                                {/* Print button - top right */}
                                <button onClick={() => handlePrint(order)} className='cursor-pointer'>
                                    <Image
                                        src="/printer.svg"
                                        className="p-2 absolute top-0 right-0"
                                        alt="Print"
                                        width={35}
                                        height={35}
                                    />
                                </button>

                                {/* Select dropdown - bottom right */}
                                <select
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(order.id, e.target.value as 'Pending' | 'Delivered' | 'Canceled')}
                                    className="text-black border rounded-lg p-2 w-full md:w-auto absolute bottom-0 right-0"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Canceled">Canceled</option>
                                </select>
                            </div>
                        </div>
                    ))}
                </div>

                {printOrder && (
                    <div style={{ display: 'none' }}>
                        <Invoice ref={contentRef} order={printOrder} />
                    </div>
                )}
            </div>
        </div>
    );
}