"use client";
import React from "react";
import { Heart, Calendar, Globe, Droplet, User, Church } from "lucide-react";
import { FaEdit } from "react-icons/fa";
import { patchStudentDetail } from "../../api/student"; // adjust import path
import EditableField from "./EditableField"; // assuming you export it separately


export default function AcademicViewTab({
    studentDetail,
    session,
    profile,
    cookyGuid,
    cookyId,
    school,
    religions,
    nationalities,
    classes,
    setIsUpdated
}) {



    if (!studentDetail) return null;

    const basePayload = {
        user_account_id: profile,
        client_id: session,
        guid: cookyGuid,
        logged_in_user_account_id: cookyId,
        id: studentDetail.id,
        school_id: school,
        class_id: studentDetail.class?.id
    };

    const handleSave = async (key, value) => {
        console.log(key, value, basePayload);

        await patchStudentDetail({ ...basePayload, [key]: value });
    };

    return (
        <div className="grid md:grid-cols-2 gap-6">
            <EditableField
                label="Class"
                value={classes?.find(cls => cls?.id === studentDetail.class_id)?.name || ""}
                icon={Droplet}
                type="select"
                options={classes}
                onSave={(val) => handleSave("classes", val)}
                setIsUpdated={setIsUpdated}
                isEditable={false}

            />


            <EditableField
                label="Roll Number"
                value={studentDetail.roll_number}
                icon={Heart}
                type="text"
                onSave={(val) => handleSave("roll_number", val)}
                setIsUpdated={setIsUpdated}
                isEditable={false}

            />


            <EditableField
                label="Registration Number"
                value={studentDetail.registration_number}
                icon={Heart}
                type="text"
                onSave={(val) => handleSave("registration_number", val)}
                setIsUpdated={setIsUpdated}
            />



            <EditableField
                label="Date of Birth"
                value={studentDetail.date_of_birth}
                icon={Calendar}
                type="date"
                onSave={(val) => handleSave("date_of_birth", val)}
                setIsUpdated={setIsUpdated}
            />

            <EditableField
                label="Height (cm)"
                value={studentDetail.height}
                icon={Heart}
                type="text"
                onSave={(val) => handleSave("height", val)}
                setIsUpdated={setIsUpdated}
            />

            <EditableField
                label="Weight (kg)"
                value={studentDetail.weight}
                icon={Heart}
                type="text"
                onSave={(val) => handleSave("weight", val)}
                setIsUpdated={setIsUpdated}
            />
        </div>
    );
}
