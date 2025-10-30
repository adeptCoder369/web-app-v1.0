"use client";
import React, { useState } from "react";
import { X, Save, Image as ImageIcon, Loader2 } from "lucide-react";
import { addHouse } from "../../api/houses";
import { getCookie } from "cookies-next";

const HouseCreate = ({
  isModalOpen,
  setIsModalOpen,
  context,
  setIsHouseUpdatedOrCreated,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo: null,
    previewUrl: null,
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const resolvedGuid = getCookie("guid");
    const resolvedUserId = getCookie("id");

    setUploading(true);

    try {
      const data = new FormData();
      data.append("api", "file.upload");
      data.append("guid", resolvedGuid);
      data.append("logged_in_user_account_id", resolvedUserId);
      data.append("user_account_id", context?.profileId);
      data.append("client_id", context?.session);
      data.append("platform", "WEB");
      data.append("file_upload_destination", "houses");
      data.append("uploaded_files[]", file);

      const resp = await fetch("/api/file.upload", {
        method: "POST",
        body: data,
      });


      const result = await resp.json();

      if (result?.success && result?.results?.files?.[0]) {
        const uploadedUrl = result.results.files[0].full_url;
        setFormData((prev) => ({
          ...prev,
          logo: uploadedUrl,
          previewUrl: uploadedUrl,
        }));
      } else {
        console.error("Upload failed:", result);
        alert("Image upload failed. Try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading file.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, description, logo } = formData;

    const resp = await addHouse(context?.profileId, context?.session, {
      name,
      description,
      logo_url: logo,
    });

    console.log("Submitted data:", resp);
    if (resp.data.success) {
      setIsModalOpen(false);
      setIsHouseUpdatedOrCreated(true);
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md p-6 border border-gray-100">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-xl font-bold text-gray-800">Create House</h3>
          <button
            onClick={() => setIsModalOpen(false)}
            className="cursor-pointer text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
              House Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter house name"
              required
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>

          {/* Upload Icon Image */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
              Icon Image
            </label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium rounded-lg border border-indigo-200 transition">
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-4 h-4" />
                    Upload
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              {formData.previewUrl && (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                  <img
                    src={formData.previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        logo: null,
                        previewUrl: null,
                      }))
                    }
                    className="absolute top-0 right-0 bg-black/40 text-white rounded-bl px-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter short description or motto"
              rows={3}
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={uploading}
              className="cursor-pointer w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
            >
              <Save className="w-5 h-5" />
              {uploading ? "Saving..." : "Save House"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HouseCreate;
