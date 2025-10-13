import axios from 'axios';
import { getCookie } from 'cookies-next';
import { API_BASE_URL } from '../config/server';



//========================================================================================================

export const getStaffApi = async ({
  profileId,
  sessionId,

  params

}) => {


  console.log('======= payload : ', params);
  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");


  return axios.post(`${API_BASE_URL}/api`, {
    "api": "user.getList",
    "guid": resolvedGuid,
    logged_in_user_account_id: resolvedUserId,
    user_account_id: profileId,
    client_id: sessionId,
    "platform": "web",
    ...params

  });
};

// ==================================================================================================




export async function getStaffDetails(profile, session, cookyGuid, cookyId, studentId) {
  console.log(profile, session, cookyGuid, cookyId, studentId);

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

      "api": "user.getDetails",
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



//========================================================================================================

export const addStaff = async (
  profile,
  session,
  cookyGuid,
  cookyId,

  payload
) => {


  console.log('=======--------------- payload : ', payload
  );

  return axios.post(`${API_BASE_URL}/api`, {
    "api": "user.add",
    "guid": cookyGuid,
    "logged_in_user_account_id": cookyId,
    "user_account_id": profile,
    "client_id": session,
    "platform": "web",
    "user_title_id": payload?.title,
    "name": payload?.name,
    "gender": payload?.gender,
    "school_designation_id": payload?.school,
    "class_id": payload?.class,
    // "date_of_birth": "1981-01-21",
    // "joining_date": "2021-01-03",
    // "is_enabled_for_invoice_notification": "1",
    // "emails": "something@somemail.com",
    // "phones": '7392988369'
    // "emergency_contact_number": "1239870455",
    // "father_name": "Test User Father",
    // "mother_name": "Test User Mother",
    // "aadhaar_number": "669933225566",
    // "address": "Somewhere in some place"
  });
};
