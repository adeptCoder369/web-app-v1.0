import React from "react";
import { getSessionCache } from "../../utils/sessionCache";
import { ChevronDown } from "lucide-react";

export default function EditClassPermissionsModal({
  isOpen,
  setIsOpen,
  staff,
  classes = [],
  selectedClass = [],
  onToggleClass,
  onClose,
  onSave
}) {

  const config = getSessionCache("dashboardConfig");

  const getSelectedClassName = () => {
    for (const std of config?.standards) {
      const cls = std.classes?.find((c) => {

        // console.log(c.id, selectedClass,'clscls');
        return (
          c.id == selectedClass?.class_id
        )
      });

      if (cls) {
        return `${std.name} - ${cls.name}${cls.section_name ? ` (${cls.section_name})` : ""}`;
      }
    }
    return "Select a class";
  };
  if (!open || !staff) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl p-6">

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Edit Class Permissions
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            ✕
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Updating permissions for <span className="font-medium">{staff.full_name}</span>
        </p>

        <div className="border rounded-lg p-4 max-h-64 overflow-y-auto">
          {config?.standards?.length === 0 ? (
            <p className="text-sm text-gray-500">No classes found.</p>
          ) : (
            <>
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Class
                </label>
                <div className="relative">
                  <select
                    // value={selectedClassValue}
                    // onChange={(e) => {
                    //   const value = e.target.value;
                    //   setSelectedClassValue(value);
                    //   setSelectedClass(JSON.parse(value));
                    // }}
                    onFocus={() => setIsOpen(true)}
                    onBlur={() => setIsOpen(false)}
                    className="w-full px-4 py-3 pr-10 border-2 border-gray-200 rounded-xl 
    text-gray-900 font-medium bg-white cursor-pointer
    transition-all duration-200 ease-in-out
    hover:border-indigo-300 hover:shadow-sm
    focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500
    appearance-none"
                  >
                    <option value="">Select a class</option>

                    {config?.standards?.map((std) => (
                      <optgroup key={std.id} label={std.name}>
                        {std.classes?.map((cls) => (
                          <option
                            key={cls.id}
                            value={JSON.stringify({
                              standard_id: std.id,
                              class_id: cls.id
                            })}
                          >
                            {cls.name} {cls.section_name ? `(${cls.section_name})` : ""}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>

                  <ChevronDown
                    className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""
                      }`}
                  />
                </div>
                {selectedClass && (
                  <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Selected:</p>
                    <p className="font-semibold text-indigo-700">{getSelectedClassName()}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button
            className="px-4 py-2 rounded-lg text-sm bg-gray-200 hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 rounded-lg text-sm bg-indigo-600 text-white hover:bg-indigo-700"
            onClick={onSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
