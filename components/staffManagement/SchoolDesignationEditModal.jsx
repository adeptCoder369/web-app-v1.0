import React, { useEffect, useState } from "react";
import { X, Briefcase, Building2 } from "lucide-react";

export default function SchoolDesignationEditModal({
  open,
  onClose,
  onCreate,
  context,
  config,
  editingDesingation
}) {
  const [form, setForm] = useState({
    id: "",
    name: "",
    department_ids: [],
    role_id: "",
    priority: "",
    adminAccess: false,
    loginAccess: false
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // Prefill when editing
  useEffect(() => {
    if (editingDesingation) {
      setForm({
        id: editingDesingation.id,
        name: editingDesingation.name || "",
        department_ids: editingDesingation.department_ids || [],
        role_id: editingDesingation.role?.id || "",
        priority: editingDesingation.priority || "",
        adminAccess: editingDesingation.is_allowed_for_admin_access === "1",
        loginAccess: editingDesingation.is_login_allowed === "1"
      });
    }

    setError("");
  }, [editingDesingation, open]);

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async () => {
    setSubmitted(true);
    setError(null);
    setSuccess(null);

    try {
      if (!form.name.trim()) {
        setError("Name is required");
        setSubmitted(false);
        return;
      }

      const payload = {
        id: form.id,
        name: form.name.trim(),
        department_ids: form.department_ids,
        role_id: form.role_id,
        priority: form.priority,
        is_allowed_for_admin_access: form.adminAccess ? "1" : "0",
        is_login_allowed: form.loginAccess ? "1" : "0"
      };

      const resp = await onCreate(
        context?.profileId,
        context?.session,
        payload
      );

      if (resp?.data?.success) {
        setSuccess("Role updated successfully");
        setTimeout(() => {
          setSuccess(null);
          onClose();
          window.location.reload();
        }, 700);
      } else {
        setError(resp?.data?.results?.message || "Failed to save role");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitted(false);
    }
  };

  const handleBackdropClick = e => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!open) return null;

  const toggleDepartment = id => {
    setForm(prev => ({
      ...prev,
      department_ids: prev.department_ids.includes(id)
        ? prev.department_ids.filter(d => d !== id)
        : [...prev.department_ids, id]
    }));
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={handleBackdropClick}
      >
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="bg-blue-700 px-6 py-5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Edit Designation
                </h2>
                <p className="text-blue-100 text-sm">Update this staff role</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5 max-h-[calc(100vh-280px)] overflow-y-auto">

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => update("name", e.target.value)}
                className="w-full px-4 py-2.5 border rounded-xl"
                placeholder="Designation name"
              />
            </div>

            {/* Department Multi Select */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Departments
              </label>
              <div className="grid grid-cols-2 gap-2">
                {config?.departments?.map(dep => (
                  <button
                    key={dep.id}
                    onClick={() => toggleDepartment(dep.id)}
                    className={`px-3 py-2 rounded-lg border text-sm ${
                      form.department_ids.includes(dep.id)
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-gray-100 text-gray-700 border-gray-300"
                    }`}
                  >
                    {dep.name}
                  </button>
                ))}
              </div>
            </div>

            {/* School Role */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                School Role
              </label>
              <select
                value={form.role_id}
                onChange={e => update("role_id", e.target.value)}
                className="w-full px-4 py-2.5 border rounded-xl bg-white"
              >
                <option value="">Select</option>
                {config?.roles?.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Priority
              </label>
              <input
                type="number"
                value={form.priority}
                onChange={e => update("priority", e.target.value)}
                className="w-full px-4 py-2.5 border rounded-xl"
                placeholder="1, 2, 3..."
              />
            </div>

            {/* Admin Access */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Admin Access
              </label>
              <div
                onClick={() => update("adminAccess", !form.adminAccess)}
                className={`w-fit cursor-pointer px-4 py-2 rounded-full text-sm font-medium ${
                  form.adminAccess
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {form.adminAccess ? "Enabled" : "Disabled"}
              </div>
            </div>

            {/* Login Access */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Login Access
              </label>
              <div
                onClick={() => update("loginAccess", !form.loginAccess)}
                className={`w-fit cursor-pointer px-4 py-2 rounded-full text-sm font-medium ${
                  form.loginAccess
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {form.loginAccess ? "Enabled" : "Disabled"}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={submitted}
              className="px-5 py-2.5 rounded-xl border text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={submitted}
              className="px-6 py-2.5 rounded-xl bg-blue-600 text-white flex items-center gap-2"
            >
              {submitted ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Briefcase className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error Toast */}
      {error && (
        <div className="fixed top-6 right-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-5 py-4 rounded-lg shadow-lg z-50">
          <div className="flex justify-between items-start gap-4">
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
            <button onClick={() => setError(null)}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {success && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-md shadow z-50">
          {success}
        </div>
      )}
    </>
  );
}
