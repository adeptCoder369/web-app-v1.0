"use client";
import React from "react";
import { User, Phone, Mail, Briefcase, MapPin, Users } from "lucide-react";
import EditableField from "./EditableField";
import { patchStudentDetail } from "../../api/student";

export default function ParentInfoViewTab({
  studentDetail,
  session,
  profile,
  cookyGuid,
  cookyId,
  school,
  setIsUpdated
}) {
  if (!studentDetail || !studentDetail.parents) return null;


  console.log(studentDetail.parents);

  const basePayload = {
    user_account_id: profile,
    client_id: session,
    guid: cookyGuid,
    logged_in_user_account_id: cookyId,
    id: studentDetail.id,
    school_id: school,
    class_id: studentDetail.class?.id
  };

  const handleSave = async (relation, key, value) => {
    // Get existing parent data
    const parent = studentDetail.parents[relation];

    // Build the updated parent object
    const updatedParent = {
      relation_with_student: relation,
      name: parent.name || "",
      gender: parent.gender || "",
      phones: parent.phones || [],
      emails: parent.emails || [],
      ...parent
    };

    // Update the correct field
    if (key === "phone") {
      updatedParent.phones = value ? [value] : [];
    } else if (key === "email") {
      updatedParent.emails = value ? [value] : [];
    } else {
      updatedParent[key] = value;
    }

    const payload = {
      ...basePayload,
      parents: [updatedParent]
    };

    await patchStudentDetail(payload);
  };


  return (
    <div className="space-y-10">
      {Object.entries(studentDetail.parents)
        .filter(([_, parent]) => parent)
        .map(([relation, parent], index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm"
          >
            <div className="flex items-center mb-4">
              <Users className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800 capitalize">
                {relation.replace("_", " ")}
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <EditableField
                label="Name"
                value={parent.name}
                icon={User}
                type="text"
                onSave={(val) => handleSave(relation, "name", val)}
                setIsUpdated={setIsUpdated}
              />

              <EditableField
                label="Phone"
                value={parent.phone}
                icon={Phone}
                type="text"
                onSave={(val) => handleSave(relation, "phone", val)}
                setIsUpdated={setIsUpdated}
              />

              <EditableField
                label="Email"
                value={parent.email}
                icon={Mail}
                type="text"
                onSave={(val) => handleSave(relation, "email", val)}
                setIsUpdated={setIsUpdated}
              />

              <EditableField
                label="Occupation"
                value={parent.occupation}
                icon={Briefcase}
                type="text"
                onSave={(val) => handleSave(relation, "occupation", val)}
                setIsUpdated={setIsUpdated}
              />

              <EditableField
                label="Address"
                value={parent.address}
                icon={MapPin}
                type="text"
                onSave={(val) => handleSave(relation, "address", val)}
                setIsUpdated={setIsUpdated}
              />

              <EditableField
                label="Is Guardian"
                value={parent.is_guardian}
                icon={Users}
                type="boolean"
                onSave={(val) => handleSave(relation, "is_guardian", val)}
                setIsUpdated={setIsUpdated}
              />
            </div>
          </div>
        ))}
    </div>
  );
}
