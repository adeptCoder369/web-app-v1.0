import React, { useState } from "react";
import { X, Briefcase, Building2 } from "lucide-react";

export default function SchoolRolesCreateModal({
  open,
  onClose,
  onCreate,
  context
}) {
  const [form, setForm] = useState({
    name: "",
    isTeachingStaff: false,
    isBusConductor: false,
    description: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async () => {
    setSubmitted(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        name: form.name?.trim(),
        isTeachingStaff: form.isTeachingStaff,
        isBusConductor: form.isBusConductor,
        description: form.description
      };

      if (!payload.name) {
        setError("Role name is required");
        setSubmitted(false);
        return;
      }

      const resp = await onCreate(
        context?.profileId,
        context?.session,
        payload
      );

      if (resp?.data?.success) {
        setSuccess(resp?.data?.results?.message || "Role saved successfully");
        setTimeout(() => {
          setSuccess(null);
          onClose();
          window.location.reload();
        }, 700);
        setSubmitted(false);
      } else {
        setError(resp?.data?.results?.message || "Failed to save role");
        setSubmitted(false);
          
      }
    } catch (err) {
      setError(err.message || "Something went wrong while saving role");
      setSubmitted(false);
    }
  };

  const handleBackdropClick = e => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
        onClick={handleBackdropClick}
      >
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Create Role</h2>
                <p className="text-blue-100 text-sm">Add a new staff role</p>
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
            <div className="space-y-5">

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Role Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => update("name", e.target.value)}
                  className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Assistant Teacher"
                />
              </div>

              {/* Teaching Staff */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.isTeachingStaff}
                  onChange={e => update("isTeachingStaff", e.target.checked)}
                  className="w-5 h-5"
                />
                <label className="text-sm font-medium text-gray-700">
                  Is Teaching Staff
                </label>
              </div>

              {/* Bus Conductor */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.isBusConductor}
                  onChange={e => update("isBusConductor", e.target.checked)}
                  className="w-5 h-5"
                />
                <label className="text-sm font-medium text-gray-700">
                  Is Bus Conductor
                </label>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={e => update("description", e.target.value)}
                  className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={4}
                  placeholder="Describe the responsibilities..."
                />
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
              className="cursor-pointer px-6 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
            >
              {submitted ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Briefcase className="w-4 h-4" />
                  Create Role
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
