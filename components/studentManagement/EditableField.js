import { useState } from "react";
import { FaEdit } from "react-icons/fa";

const EditableField = ({
  label,
  value,
  onSave,
  type = "text",
  options = [],
  icon: Icon,
  setIsUpdated,
  isEditable = true
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [temp, setTemp] = useState(value);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async () => {
    if (!temp) return setError("Cannot be empty");
    try {
      setLoading(true);
      await onSave(temp);
      setIsEditing(false);
      setIsUpdated?.(prev => !prev);
    } catch (err) {
      setError(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{label}</p>

          {isEditable ? (
            isEditing ? (
              <div className="flex gap-2 items-center">
                {type === "select" ? (
                  <select
                    value={temp}
                    onChange={(e) => setTemp(e.target.value)}
                    className="border rounded-md px-2 py-1 text-sm"
                  >
                    <option value="">Select</option>
                    {options.map(opt => (
                      <option
                        key={typeof opt === "object" ? opt.id : opt}
                        value={typeof opt === "object" ? opt.id : opt}
                      >
                        {typeof opt === "object" ? opt.name : opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={type}
                    value={temp}
                    onChange={(e) => setTemp(e.target.value)}
                    className="border-b border-blue-500 focus:outline-none bg-transparent"
                  />
                )}
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="cursor-pointer px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => { setTemp(value); setIsEditing(false); }}
                  disabled={loading}
                  className="cursor-pointer px-3 py-1 bg-gray-200 text-sm rounded-md"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-lg font-semibold text-gray-900">
                  {value || "—"}
                </p>
                <button onClick={() => setIsEditing(true)}>
                  <FaEdit className="cursor-pointer h-4 w-4 text-gray-500 hover:text-gray-700" />
                </button>
              </div>
            )
          ) : (
            <p className="text-lg font-semibold text-gray-900">{value || "—"}</p>
          )}

          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default EditableField;
