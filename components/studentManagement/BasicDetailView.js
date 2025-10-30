"use client";
import React from "react";
import {
    Home,
    Phone,
    Mail,
    MapPin,
    Droplet,
    User,
    Globe,
    Church,
    Languages,
    Calendar
} from "lucide-react";
import EditableField from "./EditableField";
import { patchStudentDetail } from "../../api/student";

export default function BasicDetailViewTab({
    studentDetail,
    session,
    profile,
    cookyGuid,
    cookyId,
    school,

    houses,
    motherTongues,
    setIsUpdated,
    classes
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
                label="Gender"
                value={studentDetail.gender}
                icon={User}
                type="select"
                options={["MALE", "FEMALE"]}
                onSave={(val) => handleSave("gender", val)}
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
                label="Roll Number"
                value={studentDetail.roll_number}
                icon={Calendar}
                type="text"
                onSave={(val) => handleSave("roll_number", val)}
                setIsUpdated={setIsUpdated}
            />


            <EditableField
                label="Registration Number"
                value={studentDetail.registration_number}
                icon={Calendar}
                type="text"
                onSave={(val) => handleSave("registration_number", val)}
                setIsUpdated={setIsUpdated}
            />



            <EditableField
                label="Admission Number"
                value={studentDetail.admission_number}
                icon={Calendar}
                type="text"
                onSave={(val) => handleSave("admission_number", val)}
                setIsUpdated={setIsUpdated}
            />
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


        </div>
    );
}