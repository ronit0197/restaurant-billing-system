'use client';

import { useState } from 'react';
import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";
import Image from 'next/image';

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

    console.log("Current Order:", currentOrder)
    console.log("orders:", orders)

    return (
        <div className="flex">
            <Navbar />
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
            <div className={`mt-15 flex-1 p-6 transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-16'}`}>
                {/* Search Section */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">Search Cuisine</h2>
                    <input
                        type="text"
                        placeholder="Search for a cuisine..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="p-2 border rounded-lg w-full"
                    />
                    <div className="mt-2 max-h-40 overflow-y-auto">
                        {availableCuisines
                            .filter(cuisine => cuisine.name.toLowerCase().includes(search.toLowerCase()))
                            .map(cuisine => (
                                <div key={cuisine.id} className="p-2 border-b flex justify-between items-center">
                                    <span>{cuisine.name} - ₹{cuisine.price}</span>
                                    <button
                                        onClick={() => handleAddCuisine(cuisine)}
                                        className="bg-rose-500 text-white px-4 py-1 rounded-lg hover:bg-rose-600"
                                    >
                                        Add
                                    </button>
                                </div>
                            ))}
                    </div>
                </div>

                {/* Current Order */}
                <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">Current Order</h2>
                    {currentOrder.map(order => (
                        <div key={order.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b py-2 gap-2">
                            <span className="block text-sm sm:text-base font-medium">{order.name} - ₹{order.price}</span>
                            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                                <input
                                    type="text"
                                    placeholder="Add-ons"
                                    className="p-2 border rounded-lg w-full sm:w-32"
                                    value={order.addons ?? ''}
                                    onChange={(e) => handleAddons(order.id, e.target.value)}
                                />
                                <input
                                    type="number"
                                    value={order.quantity ?? 1}
                                    onChange={(e) => handleQuantityChange(order.id, parseInt(e.target.value))}
                                    className="w-full sm:w-16 p-2 border rounded-lg text-center"
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
                        <span className='mt-3 font-semibold'>Total: ₹{currentOrderTotal.toFixed(2)}/-</span>
                    </div>
                </div>

                {/* Total Revenue Section */}
                <div className="mt-6 bg-white p-4 rounded-lg shadow-md text-xl font-semibold text-right">
                    <span>Total Revenue: ₹{totalRevenue.toFixed(2)}/-</span>
                </div>

                {/* Orders List */}
                <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">Orders</h2>
                    {orders.slice().reverse().map(order => (
                        <div key={order.id} className="relative p-2 border-b flex justify-between items-center bg-gray-50 mb-3">
                            <div>
                                <p className="font-semibold">Order #{order.id} <span className='font-normal ml-3'>Date:{order.date}</span></p>
                                <p className='bg-gray-100 p-2 rounded my-2'>
                                    {order.items.map((item, index) => (
                                        <span key={index} className="block">
                                            {`Item${index + 1}:`} {item.name} - ₹{item.price} Qnt: {item.quantity} {item.addons ? ` - Addons: ${item.addons}` : ''}
                                        </span>
                                    ))}
                                </p>
                                <p>Total: ₹{order.total.toFixed(2)}</p>
                                <p>Status: <span className={order.status === 'Pending' ? 'text-yellow-500' : order.status === 'Delivered' ? 'text-green-500' : 'text-red-500'}>{order.status}</span></p>
                            </div>
                            <Image src="/printer.svg" className='absolute top-2 right-2 p-2' alt="Delete" width={35} height={35} />
                            <select
                                value={order.status}
                                onChange={(e) => handleStatusChange(order.id, e.target.value as 'Pending' | 'Delivered' | 'Canceled')}
                                className="border rounded-lg p-2 absolute bottom-2 right-2 p-2"
                            >
                                <option value="Pending">Pending</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Canceled">Canceled</option>
                            </select>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}