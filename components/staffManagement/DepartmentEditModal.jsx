import React, { useState, useEffect } from "react";
import { X, Briefcase, Building2 } from "lucide-react";

export default function DepartmentEditModal({
  open,
  onClose,
  editingDept = null,

  onUpdate,
  products,
  context
}) {

  const [form, setForm] = useState({
    name: "",
    productId: [""],

    description: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [submitted, setSubmitted] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openCodeDropdown, setOpenCodeDropdown] = useState(false);

  useEffect(() => {
    if (editingDept) {
      setForm(editingDept);
    } else {
      setForm({ name: "", productId: "", description: "" });
    }
    setError("");
  }, [editingDept, open]);

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async () => {
    setSubmitted(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        // id: form.id || null,
        name: form.name?.trim() || "",
        productId: form.productId || [],
        description: form.description || ""
      };

      if (!payload.name) {
        setError("Department name is required");
        setSubmitted(false);
        return;
      }

      let resp;
      console.log(payload);
      
      

      resp = await onUpdate(
        context?.profileId,
        context?.session,
        payload
      );

      // If your API returns success like your parent example
      if (resp?.data?.success) {
        setSuccess(resp?.data?.results?.message || "Department saved successfully");
        setTimeout(() => {
          setSuccess(null);
          onClose();
          window.location.reload(); // reload after successful save

        }, 700);
        setSubmitted(false);
      } else {
        setError(resp?.data?.results?.message || "Failed to save department");
        setSubmitted(false);
      }
    } catch (err) {
      console.error("Department submit error:", err);
      setError(err.message || "Something went wrong while saving department");
      setSubmitted(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
        onClick={handleBackdropClick}
      >
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">

          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  { "Edit Department" }
                </h2>
                <p className="text-blue-100 text-sm">
                  {"Update department information" }
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5 max-h-[calc(100vh-280px)] overflow-y-auto">


            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Department Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => update("name", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-900 placeholder-gray-400"
                  placeholder="e.g., Computer Science & Engineering"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Department Code (Multiple Allowed)
                </label>

                <div className="relative">
                  <div
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl bg-white cursor-pointer flex flex-wrap gap-2 min-h-[46px] items-center"
                    onClick={() => setOpenCodeDropdown(prev => !prev)}
                  >
                    {form.productId?.length > 0 ? (
                      form.productId.map((id) => {
                        const product = products.find(p => p.id === id);
                        return (
                          <span
                            key={id}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md flex items-center gap-1"
                          >
                            {product?.name || "Unknown"}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                update(
                                  "productId",
                                  form.productId.filter(pid => pid !== id)
                                );
                              }}
                            >
                              ✕
                            </button>
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-gray-400 text-sm">Select Products</span>
                    )}
                  </div>

                  {openCodeDropdown && (
                    <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-56 overflow-y-auto z-20">
                      {products?.length > 0 ? (
                        products.map((prod) => {
                          const selected = form.productId.includes(prod.id);
                          return (
                            <div
                              key={prod.id}
                              onClick={() => {
                                if (selected) {
                                  update(
                                    "productId",
                                    form.productId.filter(pid => pid !== prod.id)
                                  );
                                } else {
                                  update("productId", [...form.productId, prod.id]);
                                }
                              }}
                              className={`px-4 py-2 cursor-pointer text-sm ${selected
                                ? "bg-blue-50 text-blue-700 font-medium"
                                : "hover:bg-gray-100"
                                }`}
                            >
                              {prod.name}
                            </div>
                          );
                        })
                      ) : (
                        <div className="px-4 py-3 text-gray-500 text-sm">
                          No products available
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>




              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={e => update("description", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-900 placeholder-gray-400 resize-none"
                  rows={4}
                  placeholder="Brief description of the department's focus and responsibilities..."
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-100 hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Briefcase className="w-4 h-4" />
                  <span>{ "Update Department" }</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="fixed top-6 right-6 flex items-center bg-red-50 border-l-4 border-red-500 text-red-700 px-5 py-4 rounded-lg shadow-lg z-50 animate-slide-in max-w-md">
          <div className="flex-1">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="ml-4">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {success && (
        <div className="fixed top-4 right-4 flex items-center bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-md shadow-md z-50">
          <span>{success}</span>
        </div>
      )}
    </>

  );
}