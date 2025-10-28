
import axios from "axios";
import { API_BASE_URL } from "../config/server";
import { getCookie } from 'cookies-next';

// ==================================================================================================
export async function getHouseList(profile, session, cookyGuid, cookyId) {

  // ==================================================================================================
  const API_BASE_URL_ = process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL;
  // ==================================================================================================
  const resolvedGuid = getCookie("guid");
  const resolvedUserId = getCookie("id");

  try {
    const response = await axios.post(`${API_BASE_URL_}/api`, {

      "api": "house.getList",

      guid: resolvedGuid,
      logged_in_user_account_id: resolvedUserId,
      "user_account_id": profile,
      "client_id": session,
      "platform": "android"
      // "version_code": "1.1.2.18"
    });

    return response.data;
  } catch (error) {
    console.error('API call error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data. Please try again.');
  }
}
// ==================================================================================================




export async function getHouseDetail(profile, session, cookyGuid, cookyId, studentId) {
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
export async function patchHouse(payload) {

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

export const addHouse = async (
  profile,
  session,
  cookyGuid,
  cookyId,

  payload
) => {


  console.log('=======--------------- payload : ', payload
  );

  return axios.post(`${API_BASE_URL}/api`, {
    "api": "student.add",
    "guid": cookyGuid,
    "logged_in_user_account_id": cookyId,
    "user_account_id": profile,
    "client_id": session,
    "platform": "web",

    "school_id": "5384",
    "name": "Test Student v 1.0",
    "roll_number": "14",
    "admission_number": "5693",
    "class_id": "100009",
    "is_new": "true",
    "fee_category": "GENERAL",
    "registration_number": "A/B-Testing666",
    "aadhar_card_number": "665599665588",
    "emails": [
      "well@somemail.com"
    ],
    "phones": [
      3212322345
    ],
    "date_of_birth": "1998-01-07",
    "gender": "MALE",
    "house_id": "1810",
    "student_fee_category_id": "GENERAL",
    "renewal_status": "NEW",
    "nationality": "INDIAN",
    "date_of_admission": "2021-01-03",
    "category": "GENERAL",
    "religion": "BUDDHISM",
    "mother_tongue": "HINDI",
    "address": "Flat 243",
    "locality": "Lake town",
    "landmark": "LT Hospital",
    "pincode": 234567,
    "city": "NameOfTheCity",
    "blood_group": "AB-",
    "height": "132",
    "weight": "42",
    "dental_hygiene": "NORMAL",
    "parents": [
      {
        "relation_with_student": "FATHER",
        "name": "Test Student Father",
        "gender": "MALE",
        "phones": [
          9870123654
        ],
        "emails": [
          "blah@blah.com"
        ]
      },
      {
        "relation_with_student": "MOTHER",
        "name": "Test Student Mother",
        "gender": "FEMALE",
        "phones": [],
        "emails": []
      }
    ],
    "registered_phone_for_sms": "9870123654",
    "emergency_contact_number": "9870123654"
  });
};
