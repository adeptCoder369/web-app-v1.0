
import axios from "axios";
import { API_BASE_URL } from "../config/server";
import { getCookie } from "cookies-next";




// ==================================================================================================

export const getStudentList = async (
  profileId,
  sessionId,
  payload = {}
) => {

  console.log('payload', payload);

  const resolvedGuid = getCookie("guid");
  const resolvedUserId = getCookie("id");



  const requestBody = {
    api: "student.getList",
    guid: resolvedGuid,
    logged_in_user_account_id: resolvedUserId,
    user_account_id: profileId,
    client_id: sessionId,
    platform: "web",
  };



  if (payload?.classId && payload.classId.trim() !== "") {
    requestBody.class_id = payload.classId;
  }

  if (payload?.name && payload.name.trim() !== "") {
    requestBody.name = payload.name;
  }

  if (payload?.status && payload.status.trim() !== "") {
    requestBody.status = payload.status;
  }
  if (payload?.appUsed && payload.appUsed.trim() !== "") {
    requestBody.app_user = payload.appUsed;
  }


  return axios.post(`${API_BASE_URL}/api`, requestBody);
};



// =================================================================================================








export async function getStudentDetail(profile, session, cookyGuid, cookyId, studentId) {
  // console.log(profile, session, cookyGuid, cookyId);

  // ==================================================================================================
  const API_BASE_URL_ = process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL;
  // ==================================================================================================

  try {
    const response = await axios.post(`${API_BASE_URL_}/api`, {
      // "api": "student.getList",
      // "perPage": "20",
      // "page": 1,
      // "guid": "1756111684.1421skt68ac234422afe1.14679239",
      // "logged_in_user_account_id": "885283",
      // "user_account_id": "558664",
      // "client_id": "2200",
      // "platform": "android"

      "api": "student.getDetails",
      // "perPage": "20",
      // "page": 1,
      "guid": cookyGuid,
      "logged_in_user_account_id": cookyId,
      "user_account_id": profile,
      "client_id": session,
      "platform": "android",
      "id": studentId
    });

    return response.data;
  } catch (error) {
    console.error('API call error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data. Please try again.');
  }
}
// ==================================================================================================



// export async function patchStudentDetail(profile, session, cookyGuid, cookyId, studentId, name) {
export async function patchStudentDetail(payload) {

  let finalPayloadd = {
    "api": "student.edit",
    "platform": "web",

    ...payload,


  }
  // console.log('finalPayloadd', finalPayloadd);

  // ==================================================================================================
  const API_BASE_URL_ = process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL;
  // ==================================================================================================

  try {
    const response = await axios.post(`${API_BASE_URL_}/api`, finalPayloadd);

    return response.data;
  } catch (error) {
    console.error('API call error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data. Please try again.');
  }
}
// ==================================================================================================



//========================================================================================================

export const addStudent = async (
  profile,
  session,
  cookyGuid,
  cookyId,

  payload
) => {


  console.log('=======--------------- payload : ', payload?.parents?.map((p) => ({
    relation_with_student: p.relation,
    name: p.name,
    gender: p.gender,
    phones: p.phones?.filter((ph) => ph && ph.trim() !== "") || [],
    emails: p.emails?.filter((em) => em && em.trim() !== "") || [],
    // qualification: p.qualification,
    // annual_income: p.annualIncome
  })));

  return axios.post(`${API_BASE_URL}/api`, {
    "api": "student.add",
    "guid": cookyGuid,
    "logged_in_user_account_id": cookyId,
    "user_account_id": profile,
    "client_id": session,
    "platform": "web",


    "school_id": payload?.school,
    "name": payload?.name,
    "roll_number": payload?.rollNo,
    "class_id": payload?.class,

    "gender": payload?.gender,
    "house_id": payload?.house,


    "admission_number": payload?.admissionNumber,
    // "is_new": payload?.admissionNumber,
    // "fee_category": payload?.admissionNumber,
    "registration_number": payload?.registrationNumber,
    "aadhar_card_number": payload?.aadharCard,
    "emails": [
      payload?.email,
    ],
    "phones": [
      payload?.alternatePhone,
    ],
    "date_of_birth": payload?.dateOfBirth,
    "gender": payload?.gender,
    "house_id": payload?.house,
    // "student_fee_category_id": payload?.admissionNumber,
    "renewal_status": payload?.renewalStatus ? payload?.renewalStatus : "NEW",
    "nationality": payload?.nationality,
    "date_of_admission": payload?.date_of_admission,
    "category": payload?.category,
    "religion": payload?.religion,
    "mother_tongue": payload?.motherTongue,
    "address": payload?.address,
    "locality": payload?.locality,
    "landmark": payload?.landmark,
    "pincode": payload?.pincode,
    "city": payload?.city,
    "blood_group": payload?.bloodGroup,
    "height": payload?.height,
    "weight": payload?.weight,
    "dental_hygiene": payload?.dentalHygiene,
    "parents": payload?.parents?.map((p) => ({
      relation_with_student: p.relation,
      name: p.name,
      gender: p.gender?.toUpperCase(),
      phones: p.phones?.map(ph => ph?.toString()?.trim()).filter(Boolean) || [],
      emails: p.emails?.filter((em) => em && em.trim() !== "") || [],
      // qualification: p.qualification,
      // annual_income: p.annualIncome
    })) || [],


    // "parents": [
    //   {
    //     "relation_with_student": payload?.relation_with_student,
    //     "name": payload?.name,
    //     "gender": payload?.gender,
    //     "phones": [
    //       payload?.phones,
    //     ],
    //     "emails": [
    //       payload?.email,
    //     ]
    //   },
    //   {
    //     "relation_with_student": payload?.relation_with_student,
    //     "name": payload?.name,
    //     "gender": payload?.gender,
    //     "phones": [],
    //     "emails": []
    //   }
    // ],
    "registered_phone_for_sms": payload?.registered_phone_for_sms,
    "emergency_contact_number": payload?.emergency_contact_number,
  });
};
