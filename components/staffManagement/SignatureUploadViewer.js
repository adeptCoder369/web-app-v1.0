"use client";
import React, { useState } from "react";
import { UploadCloud } from "lucide-react";
import { patchStudentDetail } from "../../api/student";
import { getCookie } from "cookies-next";
import EditableField from "./EditableField";
import { patchStaffDetail, uploadStaffSignature } from "../../api/staff";
import { getSessionCache } from "../../utils/sessionCache";
// ===============================================================================
export default function SignatureUploadViewer({
  staffDetail,
  session,
  profile,
  cookyGuid,
  cookyId,
  school,
  setIsUpdated,
  setShow
}) {

  // ===============================================================================

  if (!staffDetail) return null;
  // ===============================================================================

  const [uploadingKey, setUploadingKey] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  // ===============================================================================

  const basePayload = {
    user_account_id: profile,
    client_id: session,
    guid: cookyGuid,
    logged_in_user_account_id: cookyId,
    id: staffDetail.id,
    school_id: school,
    class_id: staffDetail.class?.id,
  };

  // const handleSave = async (key, value) => {
  //   await patchStaffDetail({ ...basePayload, [key]: value });
  // };

  // ===============================================================================
  const context = getSessionCache("dashboardContext");

  const uploadAndSave = async (key, file) => {
    if (!file) return;
    setError(null);
    setUploadingKey(key);

    try {
      const resolvedGuid = getCookie("guid");
      const resolvedUserId = getCookie("id");

      console.log('data ---===========', context, resolvedGuid, resolvedUserId, context?.profileId, context?.session);
      const data = new FormData();
      data.append("api", "file.upload");
      data.append("guid", resolvedGuid);
      data.append("logged_in_user_account_id", resolvedUserId);
      data.append("user_account_id", context?.profileId);
      data.append("client_id", context?.session);
      data.append("platform", "WEB");
      data.append("file_upload_destination", "user_photo_upload");
      data.append("uploaded_files[]", file);

      const resp = await fetch("/api/file.upload", {
        method: "POST",
        body: data,
      });

      const result = await resp.json();
      console.log('resp ===========', result);

      if (result?.success && result?.results?.files?.[0]) {
        const uploadedUrl = result.results.files[0].full_url;
        // console.log('uploadedUrl ===========', uploadedUrl);

        // const relativePath = uploadedUrl.split(
        //   "https://infoeight-s3-new.s3.ap-south-1.amazonaws.com/students/demo-model-school-secondary-bankura/"
        // )[1];


        // Call patch API with the uploaded URL
        let finalPayloadd = {
          "api": "user.uploadSignature",
          logged_in_user_account_id: resolvedUserId,
          "guid": resolvedGuid,
          "user_account_id": context?.profileId,
          "client_id": context?.session,
          "id": staffDetail?.id,
          "platform": "web",
          "img_signature": uploadedUrl,
        }
        const response = await uploadStaffSignature(finalPayloadd);
        if (result?.success) {
          setSuccess("File uploaded successfully.");
        }
        console.log('response ===========', response);
        // setIsUpdated((prev) => !prev);
      } else {
        setError("File upload failed.");
      }
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      // setUploadingKey(null);
      setTimeout(() =>
        setShow?.(null), 1000);

    }
  };
  // ===============================================================================

  const renderDocCard = (label, key, fileUrl) => (
    <div className="
    bg-white 
    rounded-2xl 
    p-6 
    border 
    border-gray-100 
    shadow-sm 
    flex 
    flex-col 
    items-center 
    transition-all 
    hover:shadow-md 
    hover:border-gray-200
  ">
      <button
        onClick={() => setShow?.(null)}  // ← Use either prop
        className="
      cursor-pointer
        absolute 
        top-3 
        right-3 
        h-6 
        w-6 
        rounded-full 
        flex 
        items-center 
        justify-center 
        bg-gray-100 
        text-gray-600 
        text-xs 
        hover:bg-gray-200 
        transition
      "
      >
        ✕
      </button>
      <p className="text-sm font-semibold text-gray-900 mb-4">{label}</p>

      <div className="flex flex-col items-center mb-4">
        {fileUrl ? (
          fileUrl.match(/\.(jpg|jpeg|png|webp)$/i) ? (
            <img
              src={fileUrl}
              alt={label}
              className="h-28 w-28 object-cover rounded-lg border border-gray-200 shadow-sm"
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
          )
        ) : (
          <div className="text-xs text-gray-400">No file uploaded</div>
        )}
      </div>

      {/* Download button if signature exists */}
      {fileUrl && (
        <a
          href={fileUrl}
          download
          className="
          mb-4 
          text-sm 
          text-green-600 
          hover:text-green-700 
          underline
        "
        >
          Download
        </a>
      )}

      <label
        className="
        cursor-pointer 
        flex 
        flex-col 
        items-center 
        text-blue-600 
        text-sm 
        hover:text-blue-700 
        transition-colors
      "
      >
        <UploadCloud className="h-6 w-6 mb-1" />
        {uploadingKey === key ? "Uploading..." : "Upload"}
        <input
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={(e) => uploadAndSave(key, e.target.files[0])}
        />
      </label>
    </div>
  );

  // ===============================================================================

  return (
    <>
      <div className="flex justify-center">
        <div className="w-full max-w-sm">
          {renderDocCard("Signature", "image_url", staffDetail.img_signature)}

          {error && (
            <p className="text-center text-xs font-medium text-red-500 mt-3">
              {error}
            </p>
          )}

          {success && (
            <p className="text-center text-xs font-medium text-green-600 mt-3">
              {success}
            </p>
          )}
        </div>
      </div>


    </>
  );
}
// ===============================================================================
