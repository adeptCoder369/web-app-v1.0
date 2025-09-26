'use client';
import React, { useState } from 'react';
import { ChevronDown, CheckCircle, XCircle, ReceiptIndianRupee } from "lucide-react";
import FeeCard from './FeeCard';

export default function FeeSection({ data }: { data: { dues: any[], paid: any[] } }) {
  const [activeTab, setActiveTab] = useState<"due" | "paid">("due");
  const [expanded, setExpanded] = useState<string | null>(null);
  // console.log('data',data);

  const renderFeeCard = (fee: any, isPaid: boolean) => (
    <div
      key={fee.id}
      className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{fee.name}</h3>
          <p className="mt-1 text-sm text-gray-500">
            {isPaid ? `Paid on ${fee.payment_date}` : `Due by ${fee.due_date}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${isPaid
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
              }`}
          >
            {fee.payment_status}
          </span>
          {isPaid ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <XCircle className="h-5 w-5 text-red-600" />
          )}
        </div>
      </div>

      {/* Amount + Action */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-2xl font-bold text-gray-900">
          ₹{fee.fee_amount.toLocaleString()}
        </span>
        <button
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium shadow-sm transition ${isPaid
            ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
            : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
        >
          {isPaid ? (
            <>
              <ReceiptIndianRupee className="h-4 w-4" />
              View Receipt
            </>
          ) : (
            "Pay Now"
          )}
        </button>
      </div>

      {/* Breakdown */}
      <div className="mt-4 border-t pt-3">
        <button
          className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
          onClick={() =>
            setExpanded(expanded === fee.id ? null : fee.id)
          }
        >
          Breakdown
          <ChevronDown
            className={`h-4 w-4 transition-transform ${expanded === fee.id ? "rotate-180" : ""
              }`}
          />
        </button>

        {expanded === fee.id && (
          <ul className="mt-3 space-y-2 rounded-lg bg-gray-50 p-3">
            {fee.amount_per_param.map((item: any) => (
              <li
                key={item.id}
                className="flex justify-between text-sm text-gray-700"
              >
                <span>{item.name}</span>
                <span className="font-medium">₹{item.amount}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => setActiveTab("due")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === "due" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}
        >
          Due Fees
        </button>
        <button
          onClick={() => setActiveTab("paid")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === "paid" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}
        >
          Paid Fees
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === "due" && (
          data?.dues?.length > 0
            ? data?.dues?.map(fee => {
              return (
                <FeeCard fee={fee} isPaid={false} />
                // renderFeeCard(fee, false)
              )
            })
            : <p className="text-center text-gray-500">No due fees 🎉</p>
        )}
        {activeTab === "paid" && (
          data?.paid?.length > 0
            ? data.paid.map(fee => renderFeeCard(fee, true))
            : <p className="text-center text-gray-500">No payments yet</p>
        )}
      </div>
    </div>
  );
}
