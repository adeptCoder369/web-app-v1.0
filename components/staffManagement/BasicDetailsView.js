"use client";
import React from "react";
import { Heart, Calendar, Globe, Droplet, User, Church, Mail, MapPin, Home, Languages, Phone } from "lucide-react";
import { FaEdit } from "react-icons/fa";
import { patchStaffDetail } from "../../api/staff"; // adjust import path
import EditableField from "./EditableField"; // assuming you export it separately

// const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
// const religions = ["HINDUISM", "ISLAM", "CHRISTIANITY", "SIKHISM", "BUDDHISM", "OTHER"];
// const nationalities = ["INDIAN", "OTHER"];

export default function BasicDetailsViewTab({
    staffDetail,
    session,
    profile,
    cookyGuid,
    cookyId,
    school,
    religions,
    nationalities,
    bloodGroups,
    setIsUpdated,
    houses,
    motherTongues,
    categories,
    titles,
    gender,
    designation,
    classes
}) {


    console.log(staffDetail);

    if (!staffDetail) return null;

    const basePayload = {
        user_account_id: profile,
        client_id: session,
        guid: cookyGuid,
        logged_in_user_account_id: cookyId,
        id: staffDetail.id,
        school_id: school,
        class_id: staffDetail.class?.id
    };

    const handleSave = async (key, value) => {
        await patchStaffDetail({ ...basePayload, [key]: value });
    };

    return (
        <div className="grid md:grid-cols-2 gap-6">


            <EditableField
                label="Title"
                value={staffDetail.title?.name}
                icon={Mail}
                type="select"
                options={titles}
                onSave={(val) => handleSave("user_title_id", val)}
                setIsUpdated={setIsUpdated}
            />

            <EditableField
                label="Gender"
                value={staffDetail.gender}
                icon={MapPin}
                type="select"
                options={gender}

                onSave={(val) => handleSave("gender", val)}
                setIsUpdated={setIsUpdated}
            />



            <EditableField
                label="Designation"
                value={staffDetail.designation?.name}
                icon={MapPin}
                type="select"
                options={designation}

                onSave={(val) => handleSave("school_designation_id", val)}
                setIsUpdated={setIsUpdated}
            />


            <EditableField
                label="Class"
                value={staffDetail.class?.name}
                icon={MapPin}
                type="select"
                options={classes}

                onSave={(val) => handleSave("class_id", val)}
                setIsUpdated={setIsUpdated}
            />






        </div>
    );
}
