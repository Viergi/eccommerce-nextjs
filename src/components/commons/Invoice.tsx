"use client";

import { formatRupiah, formatWaktu } from "@/lib/convert";
import React, { useEffect } from "react";
import { Card } from "../ui/card";

export type UserForOrder = {
  username: string;
  email: string;
  nomorTelepon: string;
};

export type ProductInOrderItem = {
  id: string;
  name: string;
  price: number;
};

export type OrderItemWithProduct = {
  id: string;
  quantity: number;
  product: ProductInOrderItem;
  priceAtOrder: number;
};

export type OrderWithDetails = {
  id: string;
  status: string;
  shippingAddress: string;
  orderDate: Date;
  user: UserForOrder;
  totalAmount: number;
  orderItems: OrderItemWithProduct[];
};

export default function Invoice({ order }: { order: OrderWithDetails }) {
  useEffect(() => {
    window.print();
    window.close();
  }, []);

  return (
    <div className="min-h-screen p-6 md:p-10 lg:p-16">
      <Card className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto overflow-hidden">
        <div className="p-6 md:p-10 lg:p-12">
          <div className="flex justify-between items-center border-b-2 border-gray-200 pb-6 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">FAKTUR</h1>
              <p className="text-sm text-gray-500 mt-1">Invoice #{order.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Dari:</h2>
              <p className="mt-2 text-gray-600">Eco Shop</p>
              <p className="text-gray-600">Alamat Perusahaan Eco Shop</p>
              <p className="text-gray-600">
                Email:{" "}
                <a className="text-blue-600 hover:underline">
                  ecoshop@echoshop.com
                </a>
              </p>
            </div>
            <div className="md:text-right">
              <h2 className="text-lg font-semibold text-gray-800">Untuk:</h2>
              <p className="mt-2 text-gray-600">{order.user.username}</p>
              <p className="text-gray-600">{order.shippingAddress}</p>
              <p className="text-gray-600">
                Email:{" "}
                <a className="text-blue-600 hover:underline">
                  {order.user.email}
                </a>
              </p>
              <p className="mt-4 text-sm font-semibold text-gray-700">
                Tanggal Faktur: {formatWaktu(order.orderDate)}
              </p>
            </div>
          </div>

          {/* Tabel Item Produk */}
          <div className="overflow-x-auto mb-8">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider rounded-tl-lg">
                    Item
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Jumlah
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Harga
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider rounded-tr-lg">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {order.orderItems.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {item.product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                      {formatRupiah(item.priceAtOrder)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-800">
                      {formatRupiah(item.quantity * item.priceAtOrder)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total Pembayaran */}
          <div className="flex justify-end">
            <div className="w-full md:w-1/2 lg:w-1/3">
              <div className="border-t-2 border-gray-800 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Subtotal
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatRupiah(order.totalAmount - 25000)}
                  </span>
                </div>
                <div className="flex justify-between ">
                  <span className="text-sm font-medium text-gray-800">
                    Biaya Kirim:
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    Rp25.000
                  </span>
                </div>
                <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-300">
                  <span className="text-xl font-bold text-gray-800">TOTAL</span>
                  <span className="text-xl font-bold text-blue-600">
                    {formatRupiah(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
