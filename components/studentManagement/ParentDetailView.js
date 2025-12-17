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

  const [parentPhones, setParentPhones] = React.useState({});

  React.useEffect(() => {
    if (!studentDetail?.parents) return;

    const map = {};
    Object.entries(studentDetail.parents).forEach(([relation, parent]) => {
      map[relation] = (parent.phones || [])
        .map(p => typeof p === "object" ? Number(p.phone) : Number(p))
        .filter(Boolean);
    });

    setParentPhones(map);
  }, [studentDetail]);

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
    const parent = studentDetail.parents[relation];

    const updatedParent = {
      relation_with_student: relation,
      name: parent.name || "",
      gender: parent.gender || "",
      phones: [...(parentPhones[relation] || [])],
      emails: parent.emails || []
    };

    if (key === "phone") {
      const { index, phone } = value;

      if (!phone) {
        updatedParent.phones.splice(index, 1);
      } else {
        updatedParent.phones[index] = Number(phone);
      }

      // 🔥 keep local state in sync
      setParentPhones(prev => ({
        ...prev,
        [relation]: updatedParent.phones
      }));
    } else {
      updatedParent[key] = value;
    }

    const payload = {
      ...basePayload,
      parents: [updatedParent]
    };

    console.log("FINAL PAYLOAD", payload);

    await patchStudentDetail(payload);
    setIsUpdated(true);
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

              {/* <EditableField
                label="Phone"
                value={parent?.phones?.map(cls => cls?.phone) || ""}

                // value={parent.phone}
                icon={Phone}
                type="array"
                onSave={(val) => handleSave(relation, "phone", val)}
                setIsUpdated={setIsUpdated}
              /> */}
              {(parentPhones[relation] || []).map((phone, idx) => (
                <EditableField
                  key={idx}
                  label={`Phone ${idx + 1}`}
                  value={phone}
                  icon={Phone}
                  type="text"
                  onSave={(val) =>
                    handleSave(relation, "phone", {
                      index: idx,
                      phone: val
                    })
                  }
                  setIsUpdated={setIsUpdated}
                />
              ))}



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
      {studentDetail?.siblings.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center mb-4">
            <Users className="h-5 w-5 text-indigo-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">
              Siblings
            </h3>
          </div>

          <div className="space-y-4">
            {studentDetail.siblings.map((sib) => (
              <div
                key={sib.id}
                className="flex items-center justify-between bg-white rounded-lg p-4 border"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {sib.name}
                  </p>

                  <p className="text-xs text-gray-500">
                    {sib.admission_number && `Admission No: ${sib.admission_number}`}
                    {sib.roll_number && ` • Roll: ${sib.roll_number}`}
                  </p>
                </div>

                {sib.image_url ? (
                  <img
                    src={sib.image_url}
                    alt={sib.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                    N/A
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
