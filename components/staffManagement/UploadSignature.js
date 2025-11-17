"use client";
import { useState } from "react";
import { FileText, UploadCloud, X } from "lucide-react";

export default function SignatureUploadModal({
  open,
  onClose,
  label = "Signature",
  fileUrl = null,
  onUpload,
  uploadingKey,

  key,
}) {
  const [show, setShow] = useState(open);

  // Sync internal state with parent
  if (show !== open) setShow(open);

  if (!show) return null;

  // const renderDocCard = (label, key, fileUrl) => (
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-5 relative">
        <div className="bg-blue-50 p-3 rounded-full mb-3">
          <FileText className="h-6 w-6 text-blue-600" />
        </div>

        <p className="text-sm font-semibold text-gray-800 mb-2">{label}</p>

        {fileUrl ? (
          <div className="flex flex-col items-center space-y-2">
            {fileUrl.match(/\.(jpg|jpeg|png|webp)$/i) ? (
              <img
                src={fileUrl}
                alt={label}
                className="h-24 w-24 object-cover rounded-md border"
              />
            ) : (
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline text-sm"
              >
                View File
              </a>
            )}
          </div>
        ) : (
          <div className="text-xs text-gray-400 mb-2">No file uploaded</div>
        )}

        <label className="cursor-pointer flex flex-col items-center text-blue-600 text-sm hover:text-blue-800">
          <UploadCloud className="h-5 w-5 mb-1" />
          {uploadingKey === key ? "Uploading..." : "Upload"}
          <input
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={(e) => uploadAndSave(key, e.target.files[0])}
          />
        </label>
      </div>
    </div>
  );

}
