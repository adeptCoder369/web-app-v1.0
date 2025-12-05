import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
// import { commonIcons, staffStatusIcons } from "./icons";
// ===============================================================================
// const { FaCheck } = commonIcons;
// ===============================================================================
const StudentFilterPanel = ({
  setFilters,
  config,
  isFilterPanelOpen,
  staffStatus,
  filters,
  toggleFilter,
  accountStatus

}) => {

  // console.log('config=======', config);

  // ===============================================================================

  if (!isFilterPanelOpen) {
    return null;
  }



  // ===============================================================================
  const handleSearch = () => {
    setFilters((prev) => ({
      ...prev,
      isSearch: prev =>!prev
    }));

    console.log('filters____________', filters);

  };

  // ===============================================================================
  return (
    <div className="bg-white rounded shadow border border-gray-200 p-5 mb-6 grid grid-cols-1 md:grid-cols-4 gap-6">


      {/* ======================= CLASS ======================= */}
      <div>
        <h3 className="font-medium text-gray-700 mb-3">Class</h3>

        <select
          value={filters.classId || ""}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, classId: e.target.value }))
          }
          className="w-full border border-gray-300 rounded-md p-2 text-gray-700
      focus:border-blue-500 focus:ring focus:ring-blue-200"
        >
          <option value="">All Classes</option>

          {config?.standards
            ?.flatMap((std) => std.classes || [])
            .map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
        </select>
      </div>


      {/* ======================= STUDENT NAME ======================= */}
      <div>
        <h3 className="font-medium text-gray-700 mb-3">Name</h3>
        <input
          type="text"
          placeholder="Student Name"
          value={filters.name || ""}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, name: e.target.value }))
          }
          className="border border-gray-300 rounded-md p-2 w-full focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
      </div>

      {/* ======================= ADMISSION NUMBER ======================= */}
      <div>
        <h3 className="font-medium text-gray-700 mb-3">Admission Number</h3>
        <input
          type="text"
          value={filters.admissionNo || ""}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, admissionNo: e.target.value }))
          }
          className="border border-gray-300 rounded-md p-2 w-full focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
      </div>

      {/* ======================= PHONE NO ======================= */}
      <div>
        <h3 className="font-medium text-gray-700 mb-3">Phone No.</h3>
        <input
          type="text"
          inputMode="numeric"
          maxLength={10}
          value={filters.phone || ""}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "");
            setFilters((prev) => ({ ...prev, phone: val }));
          }}
          className="border border-gray-300 rounded-md p-2 w-full focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
      </div>

      {/* ======================= FATHER NAME ======================= */}
      <div>
        <h3 className="font-medium text-gray-700 mb-3">Father's Name</h3>
        <input
          type="text"
          value={filters.fatherName || ""}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, fatherName: e.target.value }))
          }
          className="border border-gray-300 rounded-md p-2 w-full focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
      </div>

      {/* ======================= MOTHER NAME ======================= */}
      <div>
        <h3 className="font-medium text-gray-700 mb-3">Mother's Name</h3>
        <input
          type="text"
          value={filters.motherName || ""}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, motherName: e.target.value }))
          }
          className="border border-gray-300 rounded-md p-2 w-full focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
      </div>

      {/* ======================= DATE OF BIRTH ======================= */}
      <div>
        <h3 className="font-medium text-gray-700 mb-3">Date of Birth</h3>
        <input
          type="date"
          value={filters.dob || ""}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, dob: e.target.value }))
          }
          className="border border-gray-300 rounded-md p-2 w-full focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
      </div>

      {/* ======================= APP USED ======================= */}
      <div>
        <h3 className="font-medium text-gray-700 mb-3">App Used</h3>
        <select
          value={filters.appUsed || ""}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, appUsed: e.target.value }))
          }
          className="w-full border border-gray-300 rounded-md p-2 text-gray-700
      focus:border-blue-500 focus:ring focus:ring-blue-200"
        >
          <option value="">All</option>
          <option value="Android">Android</option>
          <option value="IOS">IOS</option>
        </select>
      </div>

      {/* ======================= REGISTRATION NUMBER ======================= */}
      <div>
        <h3 className="font-medium text-gray-700 mb-3">Registration Number</h3>
        <input
          type="text"
          value={filters.registrationNo || ""}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, registrationNo: e.target.value }))
          }
          className="border border-gray-300 rounded-md p-2 w-full focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
      </div>

      {/* ======================= REGISTERED PHONE FOR SMS ======================= */}
      <div>
        <h3 className="font-medium text-gray-700 mb-3">Registered Phone (SMS)</h3>
        <input
          type="text"
          inputMode="numeric"
          maxLength={10}
          value={filters.smsPhone || ""}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "");
            setFilters((prev) => ({ ...prev, smsPhone: val }));
          }}
          className="border border-gray-300 rounded-md p-2 w-full focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
      </div>

      {/* ======================= OPTIONAL SUBJECT ======================= */}
      <div>
        <h3 className="font-medium text-gray-700 mb-3">Optional Subject</h3>
        <select
          value={filters.optionalSubject || ""}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, optionalSubject: e.target.value }))
          }
          className="w-full border border-gray-300 rounded-md p-2 text-gray-700
      focus:border-blue-500 focus:ring focus:ring-blue-200"
        >
          <option value="">All</option>
          {config?.optionalSubjects?.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* ======================= GENDER ======================= */}
      <div>
        <h3 className="font-medium text-gray-700 mb-3">Gender</h3>
        <select
          value={filters.gender || ""}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, gender: e.target.value }))
          }
          className="w-full border border-gray-300 rounded-md p-2 text-gray-700
      focus:border-blue-500 focus:ring focus:ring-blue-200"
        >
          <option value="">All</option>
          <option value="MALE">MALE</option>
          <option value="FEMALE">FEMALE</option>
        </select>
      </div>

      {/* ======================= FEE CATEGORY ======================= */}
      <div>
        <h3 className="font-medium text-gray-700 mb-3">Fee Category</h3>
        <select
          value={filters.feeCategory || ""}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, feeCategory: e.target.value }))
          }
          className="w-full border border-gray-300 rounded-md p-2 text-gray-700
      focus:border-blue-500 focus:ring focus:ring-blue-200"
        >
          <option value="">All</option>
          {config?.feeCategories?.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* ======================= STATUS ======================= */}
      <div>
        <h3 className="font-medium text-gray-700 mb-3">Status</h3>
        <select
          value={filters.status || ""}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, status: e.target.value }))
          }
          className="w-full border border-gray-300 rounded-md p-2 text-gray-700
      focus:border-blue-500 focus:ring focus:ring-blue-200"
        >
          <option value="">All</option>
          {config?.statusList?.map((st) => (
            <option key={st.id} value={st.id}>
              {st.name}
            </option>
          ))}
        </select>
      </div>

      {/* ======================= EMAIL ======================= */}
      <div>
        <h3 className="font-medium text-gray-700 mb-3">Email</h3>
        <input
          type="text"
          value={filters.email || ""}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, email: e.target.value }))
          }
          className="border border-gray-300 rounded-md p-2 w-full focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
      </div>

      {/* ======================= RENEWAL STATUS ======================= */}
      <div>
        <h3 className="font-medium text-gray-700 mb-3">Renewal Status</h3>
        <select
          value={filters.renewalStatus || ""}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, renewalStatus: e.target.value }))
          }
          className="w-full border border-gray-300 rounded-md p-2 text-gray-700
      focus:border-blue-500 focus:ring focus:ring-blue-200"
        >
          <option value="">All</option>
          {config?.renewalStatus?.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      {/* ======================= RADIO GROUPS ======================= */}
      <div className="col-span-4 border-t pt-4 flex flex-wrap gap-6">

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="notUsingApp"
            checked={filters.notUsingApp === true}
            onChange={() => setFilters((prev) => ({ ...prev, notUsingApp: true }))}
          />
          Not Using App
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="registeredStudents"
            checked={filters.registeredStudents === true}
            onChange={() =>
              setFilters((prev) => ({ ...prev, registeredStudents: true }))
            }
          />
          Registered Students
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="withoutPhone"
            checked={filters.noPhone === true}
            onChange={() => setFilters((prev) => ({ ...prev, noPhone: true }))}
          />
          Without any phone number
        </label>


        {/* ======================= SEARCH BUTTON ======================= */}
        <div className="col-span-4 flex justify-end mt-4">
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>

      </div>

    </div>
  );
};
// ===============================================================================
export default StudentFilterPanel;
