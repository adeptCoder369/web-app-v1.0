import React, { useState, useMemo, useEffect } from "react";
import { X, CheckCircle } from "lucide-react";
import { getFee } from "../../api/fees";
import { getSessionCache } from "../../utils/sessionCache";

export default function ManageAccessModal({
  open,
  onClose,
  feeList = [],
  feeTypes = [],
  onUpdate,
  loading,
  setLoading
}) {
  if (!open) return null;
  // console.log('feeList =======>>', feeList);

  const [selectedFees, setSelectedFees] = useState([]);
  const [selectedFeeTypeId, setSelectedFeeTypeId] = useState("");
  const [amount, setAmount] = useState("");
  const [fees, setFees] = useState([]);





  const config = getSessionCache("dashboardConfig");
  const context = getSessionCache("dashboardContext");

  const fetchFees = async () => {

    // console.log('context_____', context);

    let page = 1
    let limit = 20
    try {
      const re = await getFee(
        context?.profileId,
        context?.session,
        page,
        limit,

        // currentPage,
        // pageSize,
        // {
        //   feeType: filters?.feeType || "",
        //   standards: filters?.standards || [],
        //   enabled: filters?.enabled ?? "",
        //   hostelFee: filters?.hostelFee ?? "",
        //   startDate: filters?.startDate || "",
        //   endDate: filters?.endDate || "",
        //   dueDate: filters?.dueDate || "",
        // }
      );

      // console.log('re', re?.data?.results?.fees);


      if (re.status) {
        setFees(re?.data?.results?.fees || []);
      }

    } catch (error) {
      console.error("Error fetching fees:", error);
    }
  };





  useEffect(() => {


    fetchFees();

    // setFilters((prev) => ({ ...prev, type: config?.fee_frequency[0]?.value || "" }));

    // setIsFilterPanelOpen(false)
  }, [



  ]);


  const toggleFee = (id) => {
    setSelectedFees((prev) =>
      prev.includes(id)
        ? prev.filter((f) => f !== id)
        : [...prev, id]
    );
  };

  // console.log('fees==================================>>', fees);


  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-40"
      />

      <div className="fixed right-0 top-0 h-full w-full sm:w-[450px] bg-white z-50 shadow-xl p-6 overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b">
          <h2 className="text-xl font-bold">Manage Access</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Multi Select Fee */}
        <div className="mb-6">
          <label className="text-sm font-semibold mb-2 block">Select Fees</label>

          <div className="max-h-60 overflow-y-auto border border-gray-300  rounded-xl p-3 space-y-2">
            {fees.map((fee) => {
              const isSelected = selectedFees.includes(fee.id);
              return (
                <div
                  key={fee.id}
                  onClick={() => toggleFee(fee.id)}
                  className={`p-3 border border-gray-300  rounded-lg flex justify-between items-center cursor-pointer ${isSelected ? "bg-indigo-50 border-indigo-300" : "hover:bg-gray-50"
                    }`}
                >
                  <span className="text-sm font-medium">{fee.name}</span>

                  {isSelected ? (
                    <CheckCircle className="w-5 h-5 text-indigo-600" />
                  ) : (
                    <span className="w-5 h-5 border border-gray-300  rounded-full"></span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Fee Type (single select) */}
        <div className="mb-6">
          <label className="text-sm font-semibold mb-2 block">Fee Type</label>

          <select
            value={selectedFeeTypeId}
            onChange={(e) => setSelectedFeeTypeId(e.target.value)}
            className="w-full border    border-gray-300   px-3 py-2 rounded-lg"
          >
            <option value="">Select Fee Type</option>
            {feeTypes.map((ft) => (
              <option key={ft.id} value={ft.id}>
                {ft.name}
              </option>
            ))}
          </select>
        </div>

        {/* Amount Field */}
        <div className="mb-8">
          <label className="text-sm font-semibold mb-2 block">Amount</label>

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full border border-gray-300  px-3 py-2 rounded-lg"
          />
        </div>

        {/* Update Button */}
        <button
          disabled={loading}

          onClick={() =>
            onUpdate?.({
              selectedFees,
              selectedFeeTypeId,
              amount: Number(amount)

            })
          }
          className={`cursor-pointer w-full py-3 rounded-lg text-white font-medium
    ${loading ? "bg-indigo-300" : "bg-indigo-600 hover:bg-indigo-700"}
  `}        >
          {loading ? "Updating..." : "Update"}
        </button>

      </div>
    </>
  );
}
