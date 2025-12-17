import { useEffect, useRef, useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";

export default function StandardEditModal({
  initialData = {},
  studentOptions = [],
  packageOptions = [],
  levelOptions = [],
  onSave,
  onClose,
  config

}) {
  console.log('config',config);
  
  const [form, setForm] = useState({
    name: initialData?.name || "",
    // students: initialData.students || [],
    // packageId: initialData.packageId || "",
    // minAttendance: initialData.minAttendance || "",
    // priority: initialData.priority || "",
    // sessionStart: initialData.sessionStart || "",
    // sessionEnd: initialData.sessionEnd || "",
    // level: initialData.level || ""
  });
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if (initialData || Object.keys(initialData).length > 0) {
      setIsVisible(true);
    }
  }, [initialData]);


  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const toggleStudent = (id) => {
    setForm(prev => ({
      ...prev,
      students: prev.students.includes(id)
        ? prev.students.filter(s => s !== id)
        : [...prev.students, id]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave?.(form);
  };

  return (
    <div
      // onClick={onClose}
      className={`fixed inset-0  backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
    >
      <div
        ref={modalRef}
        className={` border-6  border-[#15487d] bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden relative transform transition-all duration-300 ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
          }`}
      >
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-6 max-w-3xl">
          <h2 className="text-xl font-semibold text-gray-800">Edit Standard</h2>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => handleChange("name", e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Student Records */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Student Records</label>
            <div className="border rounded-lg max-h-40 overflow-y-auto p-2 space-y-1">
              {studentOptions.map(s => (
                <label key={s.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.students.includes(s.id)}
                    onChange={() => toggleStudent(s.id)}
                  />
                  <span>{s.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Package */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Package</label>
            <select
              value={form.packageId}
              onChange={e => handleChange("packageId", e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            >
              <option value="">Select package</option>
              {packageOptions.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Attendance & Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Minimum Attendance %</label>
              <input
                type="number"
                min={0}
                max={100}
                value={form.minAttendance}
                onChange={e => handleChange("minAttendance", e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Priority</label>
              <input
                type="number"
                value={form.priority}
                onChange={e => handleChange("priority", e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Session Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Session Start Date</label>
              <input
                type="date"
                value={form.sessionStart}
                onChange={e => handleChange("sessionStart", e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Session End Date</label>
              <input
                type="date"
                value={form.sessionEnd}
                onChange={e => handleChange("sessionEnd", e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Standard Level */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Standard Level</label>
            <select
              value={form.level}
              onChange={e => handleChange("level", e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            >
              <option value="">Select level</option>
              {levelOptions.map(l => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm border"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-sm bg-blue-600 text-white"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
