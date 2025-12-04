import React, { useState, useMemo, useEffect } from "react";
import { X, CheckCircle } from "lucide-react";
import ManageAccessModal from "./ManageAccessModal";
import { getFeeTypes, addVariableFeeTypeStudentApi } from "../../api/fees";
import ConfirmationDialogueBox from "../ui/status/Confirmation";
// ========================================================
export default function AddFeeTypeStudents({
  open,
  onClose,
  config,
  context,
  setSelectedStudent,
  selectedStudent

}) {
  // console.log('config',config);

  // ========================================================
  if (!open) return null;
  // ========================================================
  const [selectedStandardId, setSelectedStandardId] = useState("");
  const [search, setSearch] = useState("");
  const [manageModalOpen, setManageModalOpen] = useState(false);
  const [activeStudent, setActiveStudent] = useState(null);
  const [fees, setFees] = useState([]);
  const [allowFullConcession, setAllowFullConcession] = useState(null);
  const [apiResponse, setApiResponse] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchFeesTypes = async () => {
    try {
      const re = await getFeeTypes(
        context?.profileId,
        context?.session,
        (page = 1),
        (limit = 20)
      );

      if (re.status) {
        setFees(re?.data?.results?.fee_types || []);
      }
    } catch (error) {
      console.error("Error fetching fees:", error);
    }
  };

  useEffect(() => {
    fetchFeesTypes();
  }, []);




  const selectedStandard = useMemo(() => {
    return config?.standards?.find(
      s => String(s.id) === String(selectedStandardId)
    );
  }, [selectedStandardId, config]);

  const allStudents = useMemo(() => {
    if (!selectedStandard) return [];

    const items = selectedStandard.classes?.flatMap(cls =>
      cls.students?.map(stu => ({
        ...stu,
        className: cls.name
      }))
    );

    const q = search.toLowerCase();

    return items.filter(stu =>
      stu.name.toLowerCase().includes(q) ||
      String(stu.admission_no || "").includes(q) ||
      String(stu.phone || "").includes(q)
    );
  }, [selectedStandard, search]);

  const handleManageAccess = (student) => {
    setActiveStudent(student);
    setManageModalOpen(true);
  };

const updateStudentFeeType = async (payload) => {
  setLoading(true);
  setError(false);
  setApiResponse("");
  setShowSuccess(false);

  try {
    const matchedClass = selectedStandard?.classes?.find(
      cls => cls.name === selectedStudent?.className
    );

    const finalPayload = {
      ...payload,
      selectedStudent,
      selectedStandard,
      classId: matchedClass?.id || null
    };

    const result = await addVariableFeeTypeStudentApi(
      context.profileId,
      context.session,
      finalPayload
    );

    if (result?.data?.success) {
      setShowSuccess(true);
      setApiResponse({
        message: result.data?.results?.message
      });

      // close modal + cleanup
      setManageModalOpen(false);

      setTimeout(() => {
        setShowSuccess(false);
        setApiResponse("");
      }, 3000);

    } else {
      setError(true);
      setApiResponse({
        status: "error",
        message: result.data?.results?.message
      });

      setTimeout(() => {
        setError(false);
        setApiResponse("");
      }, 3000);
    }

  } catch (err) {
    setError(true);
    setApiResponse({
      status: "error",
      message: "Request failed."
    });

    setTimeout(() => {
      setError(false);
      setApiResponse("");
    }, 3000);

  } finally {
    setLoading(false);
  }
};


  // ========================================================
  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-40 transition-opacity"
      />

      <div className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-white z-50 shadow-2xl p-6 overflow-y-auto rounded-l-xl">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b">
          <h2 className="text-xl font-semibold tracking-tight">Mark Fee</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* STANDARD */}
        <div className="mb-5">
          <label className="text-sm font-medium mb-2 block">
            Select Standard
          </label>

          <select
            value={selectedStandardId}
            onChange={e => {
              setSelectedStandardId(e.target.value);
              setSelectedStudent(null);
            }}
            className="w-full border border-gray-300  px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="">Choose Standard</option>
            {config?.standards?.map(std => (
              <option key={std.id} value={std.id}>
                {std.name}
              </option>
            ))}
          </select>
        </div>

        {/* SEARCH */}
        <div className="mb-5">
          <input
            type="text"
            placeholder="Search student..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border border-gray-300  px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* STUDENT SELECT */}
        <div>
          <label className="text-sm font-medium mb-3 block">
            Select Student
          </label>

          {!selectedStandard && (
            <p className="text-xs text-gray-500">Select a standard above.</p>
          )}

          {selectedStandard && (
            <div className="max-h-72 overflow-y-auto border border-gray-300  rounded-xl p-3 bg-gray-50 space-y-2">
              {allStudents.map(stu => {
                const isSelected = selectedStudent?.id === stu.id;

                return (
                  <div
                    key={stu.id}
                    className={`p-3 border border-gray-300  rounded-lg flex justify-between items-center cursor-pointer transition
                      ${isSelected ? "bg-indigo-50 border-indigo-300" : "hover:bg-gray-100"}
                    `}
                    onClick={() => setSelectedStudent(stu)}
                  >
                    <div>
                      <p className="font-medium">{stu.name}</p>
                      <p className="text-xs text-gray-500">
                        {stu.className} • {stu.admission_no}
                      </p>
                    </div>

                    {isSelected ? (
                      <CheckCircle className="w-5 h-5 text-indigo-600" />
                    ) : (
                      <span className="w-5 h-5 rounded-full border" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ACTIONS */}
        {selectedStudent && (
          <div
            className="mt-6 p-4 border border-gray-300 rounded-xl bg-gray-50 space-y-3 shadow-sm"
          >

            <h3 className="text-sm font-semibold text-gray-700">
              Actions
            </h3>

            <button
              className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition"
              onClick={() => handleManageAccess(selectedStudent)}
            >
              Add To Fee Type
            </button>

            <button
              className="w-full py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition"
              onClick={() => setAllowFullConcession(selectedStudent)}
            >
              Give Full Concession
            </button>

          </div>
        )}

        {/* MANAGE_ACCESS */}
        <ManageAccessModal
          open={manageModalOpen}
          onClose={() => setManageModalOpen(false)}
          feeList={fees}
          feeTypes={config?.fee_types}
          onUpdate={updateStudentFeeType}
          loading={loading}
          setLoading={setLoading}

        />

        {/* FULL CONCESSION */}
        {allowFullConcession && (
          <ConfirmationDialogueBox
            title="Confirm Full Concession"
            description={`Are you sure you want to grant full concession for "${allowFullConcession.name}"?`}
            onConfirm={allowFullConcession}
            onCancel={() => setAllowFullConcession(null)}
          />
        )}

        <div className="fixed right-0 top-0 w-full sm:w-[480px] z-[60] p-4 space-y-3">

          {showSuccess && (
            <div className="relative bg-green-100 border border-green-300 text-green-800 rounded-lg px-4 py-3 shadow-md">
              <span className="font-medium">{apiResponse.message}</span>
            </div>
          )}

          {error && (
            <div className="relative bg-red-100 border border-red-300 text-red-800 rounded-lg px-4 py-3 shadow-md">
              <span className="font-medium">{apiResponse.message}</span>
            </div>
          )}

        </div>


      </div>
    </>
  );
}
