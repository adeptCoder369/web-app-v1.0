"use client"
import React, { use, useEffect, useState } from 'react';
import { Calendar, CreditCard, MoreVertical, Receipt, PieChart, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Layout from '../../../../../layouts/Layout';
import { useStudentFees } from '../../../../../controllers/fees';
import { IoMdCloseCircle } from "react-icons/io";

const PaymentCard = ({ payment, isPaid, onBreakdown, onViewReceipt }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const getStatusIcon = () => {
    if (isPaid) return <CheckCircle className="w-5 h-5 text-emerald-500" />;
    const isOverdue = new Date(payment.dueDate) < new Date();
    return isOverdue ?
      <AlertCircle className="w-5 h-5 text-red-500" /> :
      <Clock className="w-5 h-5 text-amber-500" />;
  };

  const getStatusColor = () => {
    if (isPaid) return 'bg-emerald-50 border-emerald-200';
    const isOverdue = new Date(payment.dueDate) < new Date();
    return isOverdue ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200';
  };

  return (

    <div className={`bg-white rounded-2xl border-2 ${getStatusColor()} p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <h3 className="font-bold text-xl text-gray-800">{payment.name}</h3>
            <p className="text-gray-500 text-sm">{payment.month}</p>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-10 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-10 min-w-48">
              <button
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors duration-200"
                onClick={() => {
                  setShowDropdown(false);
                  if (typeof onBreakdown === 'function') onBreakdown();
                }}
              >
                <PieChart className="w-4 h-4 text-blue-500" />
                <span className="text-gray-700">View Breakdown</span>
              </button>
              <button
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors duration-200"
                onClick={() => {
                  setShowDropdown(false);
                  if (payment.fee_receipt?.url) {
                    // Call the parent's handler if passed as prop
                    if (typeof onViewReceipt === 'function') {
                      onViewReceipt(payment.fee_receipt.url, payment.fee_receipt.name);
                    }
                  }
                }}
              >
                <Receipt className="w-4 h-4 text-green-500" />
                <span className="text-gray-700">View Receipt</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Amount</span>
          <span className="text-2xl font-bold text-gray-900">₹  {payment.amount}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Due Date</span>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-gray-800 font-medium">{payment.dueDate}</span>
          </div>
        </div>

        {isPaid && (
          <>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Paid On</span>
              <span className="text-green-600 font-semibold">{payment.paidOn}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Payment Mode</span>
              <div className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-blue-500" />
                <span className="text-gray-800 font-medium">{payment.mode}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {!isPaid && (
        <button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
          Pay Now
        </button>
      )}
    </div>

  );
};

const PaymentManagement = ({ params }) => {
  const [receiptModal, setReceiptModal] = useState({ open: false, url: '', name: '' });
  const [breakdownModal, setBreakdownModal] = useState({ open: false, breakdown: [] });

  const unwrappedParams = use(params); // <-- unwrap the promise
  let profileId = unwrappedParams?.profile;
  let sessionId = unwrappedParams?.session;


  const { getStudentFees, studetnFeesData, isLoading } = useStudentFees();

  useEffect(() => {
    getStudentFees(profileId, sessionId);
  }, []);

  const [activeTab, setActiveTab] = useState('due');


  const duePayments = studetnFeesData?.dues || [];
  const paidPayments = studetnFeesData?.paid || [];
  const currentPayments = activeTab === 'due' ? duePayments : paidPayments;


  return (
    <Layout
      // dashboardData={dashboardData?.results}
    >   
       <div
      style={{
        backgroundImage: "url('/bg/appbackground@2x.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Payment Management</h1>
            <p className="text-gray-600 text-lg">Track your course payments and manage your billing</p>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-2xl shadow-md p-2 mb-8 inline-flex">
            <button
              onClick={() => setActiveTab('due')}
              className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${activeTab === 'due'
                ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md transform scale-105'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
            >
              Due Payments
              <span className="ml-2 px-2 py-1 rounded-full text-xs bg-red-100 text-red-600">
                {duePayments.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('paid')}
              className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${activeTab === 'paid'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md transform scale-105'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
            >
              Paid
              <span className="ml-2 px-2 py-1 rounded-full text-xs bg-green-100 text-green-600">
                {paidPayments.length}
              </span>
            </button>
          </div>

          {/* Payment Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPayments.map((payment, index) => (
              // <PaymentCard
              //   key={`${payment.course}-${payment.month}`}
              //   payment={payment}
              //   isPaid={activeTab === 'paid'}
              // />
              <PaymentCard
                key={payment.id}
                payment={{
                  name: payment.name,
                  month: payment.payment_status, // or extract month if needed
                  amount: payment.fee_amount,
                  dueDate: payment.due_date,
                  paidOn: payment.payment_date,
                  mode: payment.mode,
                  options: payment.options,
                  amount_per_param: payment.amount_per_param,
                  fee_receipt: payment.fee_receipt,
                }}
                isPaid={activeTab === 'paid'}
                onBreakdown={() => {
                  console.log("Payment breakdown:", activeTab, payment.amount_per_param);

                  setBreakdownModal({
                    open: true,
                    breakdown: activeTab === 'paid' ? payment.amount_per_param : payment[activeTab].amount_per_param
                  });
                }}
                onViewReceipt={(url, name) => {
                  setReceiptModal({ open: true, url, name });
                }}

              />
            ))}
          </div>

          {/* Summary Stats */}
          {/* <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-blue-100">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Total Due</h3>
              </div>
              <p className="text-3xl font-bold text-blue-600">
                ₹{duePayments.reduce((sum, p) => sum + p.amount, 0)}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-green-100">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Total Paid</h3>
              </div>
              <p className="text-3xl font-bold text-green-600">
                ₹{paidPayments.reduce((sum, p) => sum + p.amount, 0)}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-purple-100">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CreditCard className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-800">This Month</h3>
              </div>
              <p className="text-3xl font-bold text-purple-600">
                ₹{duePayments
                  .filter(p => (p.name || '').includes('December'))
                  .reduce((sum, p) => sum + Number(p.fee_amount || 0), 0)
                }              </p>
            </div>
          </div> */}
        </div>
        {breakdownModal.open && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.6)] backdrop-blur-sm"
            onClick={() => setBreakdownModal({ open: false, breakdown: [] })}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative"
              onClick={e => e.stopPropagation()} // Prevent closing when clicking inside the modal
            >
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
                onClick={() => setBreakdownModal({ open: false, breakdown: [] })}
              >
                <IoMdCloseCircle className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Fee Breakdown</h2>
              <div className="divide-y">
                {breakdownModal.breakdown.length === 0 ? (
                  <div className="text-gray-500 py-4">No breakdown available.</div>
                ) : (
                  breakdownModal.breakdown.map((item) => (
                    <div key={item.id} className="flex justify-between py-2">
                      <span className="text-gray-700">{item.name}</span>
                      <span className="font-semibold text-gray-900">₹ {item.amount}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}


        {receiptModal.open && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.6)] backdrop-blur-sm p-4 sm:p-6 md:p-8"
            onClick={() => setReceiptModal({ open: false, url: '', name: '' })}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-lg relative
                 max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 z-10"
                onClick={() => setReceiptModal({ open: false, url: '', name: '' })}
              >
                <IoMdCloseCircle className="w-6 h-6" />
              </button>
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">Fee Receipt</h2>
              <div className="mb-4 text-sm sm:text-base">
                <span className="font-semibold text-gray-700">Receipt Name: </span>
                <span className="text-gray-900">{receiptModal.name}</span>
              </div>
              {receiptModal.url ? (
                <div className="mb-4">
                  {/* Try to show as image, fallback to PDF link */}
                  {receiptModal.url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                    <img
                      src={receiptModal.url}
                      alt="Fee Receipt"
                      className="w-full h-auto max-h-[70vh] object-contain rounded-lg border"
                    />
                  ) : (
                    <iframe
                      src={receiptModal.url}
                      title="Fee Receipt"
                      className="w-full h-[60vh] md:h-[70vh] rounded-lg border"
                    />
                  )}
                </div>
              ) : (
                <div className="text-gray-500 py-4 text-center">No receipt available.</div>
              )}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                <a
                  href={receiptModal.url}
                  download={receiptModal.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition
                     text-center text-sm sm:text-base"
                >
                  Download Receipt
                </a>
                <button
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition
                     text-center text-sm sm:text-base"
                  onClick={() => setReceiptModal({ open: false, url: '', name: '' })}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PaymentManagement;