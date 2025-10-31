"use client";
import React from "react";
import { Heart, Calendar, Globe, Droplet, User, Church, Mail, MapPin, Home, Languages, Phone, PhoneCall, Text, MapIcon } from "lucide-react";
import { FaEdit } from "react-icons/fa";
import { patchStaffDetail } from "../../api/staff"; // adjust import path
import EditableField from "./EditableField"; // assuming you export it separately
import { BiCategory } from "react-icons/bi";
import { SiNamebase } from "react-icons/si";

// const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
// const religions = ["HINDUISM", "ISLAM", "CHRISTIANITY", "SIKHISM", "BUDDHISM", "OTHER"];
// const nationalities = ["INDIAN", "OTHER"];

export default function PersonalDetailsViewTab({
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
    category
}) {


    console.log('[---', staffDetail.emails[0]?.email);

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
                label="Date Of Birth"
                value={staffDetail.date_of_birth}
                icon={Calendar}
                type="date"
                onSave={(val) => handleSave("date_of_birth", val)}
                setIsUpdated={setIsUpdated}
            />


            <EditableField
                label="Date Of Joining"
                value={staffDetail.joining_date}
                icon={Calendar}
                type="date"
                onSave={(val) => handleSave("joining_date", val)}
                setIsUpdated={setIsUpdated}
            />





            <EditableField
                label="Enabled for Invoice Notification"
                value={staffDetail.joining_date}
                icon={Calendar}
                type="boolean"
                onSave={(val) => handleSave("joining_date", val)}
                setIsUpdated={setIsUpdated}
            />

            <EditableField
                label="Is Class Coordinator"
                value={staffDetail.class_coordinator_standard}
                icon={Calendar}
                type="boolean"
                onSave={(val) => handleSave("class_coordinator_standard", val)}
                setIsUpdated={setIsUpdated}
            />




            <EditableField
                label="Category"
                value={staffDetail.category}
                icon={BiCategory}
                type="select"
                options={category}
                onSave={(val) => handleSave("category", val)}
                setIsUpdated={setIsUpdated}
            />




            <EditableField
                label="Blood Group"
                value={staffDetail.blood_group}
                icon={BiCategory}
                type="select"
                options={bloodGroups}
                onSave={(val) => handleSave("blood_group", val)}
                setIsUpdated={setIsUpdated}
            />




            <EditableField
                label="Emails"
                value={staffDetail.emails[0]?.email}
                icon={BiCategory}
                type="text"
                onSave={(val) => handleSave("emails", val)}
                setIsUpdated={setIsUpdated}
            />


            <EditableField
                label="Phone No(s)"
                value={staffDetail.phones[0]?.phone}
                icon={PhoneCall}
                type="text"
                onSave={(val) => handleSave("phones", val)}
                setIsUpdated={setIsUpdated}
            />


            <EditableField
                label="Emergency Contact No."
                value={staffDetail.emergency_contact_number}
                icon={PhoneCall}
                type="text"
                onSave={(val) => handleSave("emergency_contact_number", val)}
                setIsUpdated={setIsUpdated}
            />


            <EditableField
                label="Father's Name"
                value={staffDetail.father_name}
                icon={Text}
                type="text"
                onSave={(val) => handleSave("father_name", val)}
                setIsUpdated={setIsUpdated}
            />




            <EditableField
                label="Mother's Name"
                value={staffDetail.mother_name}
                icon={Text}
                type="text"
                onSave={(val) => handleSave("mother_name", val)}
                setIsUpdated={setIsUpdated}
            />




            <EditableField
                label="Spouse's Name"
                value={staffDetail.spouse_name}
                icon={Text}
                type="text"
                onSave={(val) => handleSave("spouse_name", val)}
                setIsUpdated={setIsUpdated}
            />




            <EditableField
                label="Son's Name"
                value={staffDetail.name_of_son}
                icon={Text}
                type="text"
                onSave={(val) => handleSave("name_of_son", val)}
                setIsUpdated={setIsUpdated}
            />


            <EditableField
                label="Daughter's Name"
                value={staffDetail.name_of_daughter}
                icon={Text}
                type="text"
                onSave={(val) => handleSave("name_of_daughter", val)}
                setIsUpdated={setIsUpdated}
            />


            <EditableField
                label="Current Address"
                value={staffDetail.address}
                icon={MapIcon}
                type="text"
                onSave={(val) => handleSave("address", val)}
                setIsUpdated={setIsUpdated}
            />


            <EditableField
                label="Permanent Address"
                value={staffDetail.permanent_address}
                icon={MapIcon}
                type="text"
                onSave={(val) => handleSave("permanent_address", val)}
                setIsUpdated={setIsUpdated}
            />




        </div>
    );
}
