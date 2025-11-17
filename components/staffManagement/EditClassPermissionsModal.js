import React from "react";

export default function EditClassPermissionsModal({
  open,
  staff,
  classes = [],
  selectedClasses = [],
  onToggleClass,
  onClose,
  onSave
}) {
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
          {classes.length === 0 ? (
            <p className="text-sm text-gray-500">No classes found.</p>
          ) : (
            <ul className="space-y-2">
              {classes.map((cls) => {
                const isSelected = selectedClasses.includes(cls.id);

                return (
                  <li
                    key={cls.id}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                  >
                    <span className="text-sm text-gray-700">
                      {cls.standard_name} {cls.section_name && ` - ${cls.section_name}`}
                    </span>

                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleClass(cls.id)}
                      className="w-4 h-4 accent-indigo-600"
                    />
                  </li>
                );
              })}
            </ul>
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
