import React, { forwardRef } from "react";

const Invoice = forwardRef<HTMLDivElement, { order: any }>(({ order }, ref) => (
    <div ref={ref} className="p-6">
        <h2 className="text-2xl font-bold mb-4">Invoice</h2>
        <p className="text-lg font-semibold">Order #{order.id}</p>
        <p className="text-sm text-gray-600">Date: {order.date}</p>
        <div className="border-t my-4"></div>

        <div className="bg-gray-100 p-4 rounded-lg">
            {order.items.map((item: any, index: number) => (
                <div key={index} className="border border-gray-300 rounded p-2 mb-2">
                    <p className="text-black">
                        {`Item${index + 1}:`} {item.name} - ₹{item.price} Qnt: {item.quantity}
                    </p>
                    {item.addons && (
                    <p className="text-black text-sm">Addons: {item.addons}</p>
                    )}
                </div>
            ))}
        </div>

        <p className="text-lg font-semibold mt-3">Total: ₹{order.total.toFixed(2)}</p>
        <p className="text-lg"><span className="font-bold">Status:</span> {order.status}</p>
    </div>
));

Invoice.displayName = "Invoice";
export default Invoice;