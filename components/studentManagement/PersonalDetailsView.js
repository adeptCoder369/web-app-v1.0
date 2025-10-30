"use client";
import React from "react";
import { Heart, Calendar, Globe, Droplet, User, Church } from "lucide-react";
import { FaEdit } from "react-icons/fa";
import { patchStudentDetail } from "../../api/student"; // adjust import path
import EditableField from "./EditableField"; // assuming you export it separately

// const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
// const religions = ["HINDUISM", "ISLAM", "CHRISTIANITY", "SIKHISM", "BUDDHISM", "OTHER"];
// const nationalities = ["INDIAN", "OTHER"];

export default function PersonalDetailsViewTab({
    studentDetail,
    session,
    profile,
    cookyGuid,
    cookyId,
    school,
    religions,
    nationalities,
    bloodGroups,
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
        await patchStudentDetail({ ...basePayload, [key]: value });
    };

    return (
        <div className="grid md:grid-cols-2 gap-6">
            <EditableField
                label="Blood Group"
                value={studentDetail.blood_group}
                icon={Droplet}
                type="select"
                options={bloodGroups}
                onSave={(val) => handleSave("blood_group", val)}
                setIsUpdated={setIsUpdated}
            />

            <EditableField
                label="Religion"
                value={studentDetail.religion}
                icon={Church}
                type="select"
                options={religions}
                onSave={(val) => handleSave("religion", val)}
                setIsUpdated={setIsUpdated}
            />

            <EditableField
                label="Nationality"
                value={studentDetail.nationality}
                icon={User}
                type="select"
                options={nationalities}
                onSave={(val) => handleSave("nationality", val)}
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
