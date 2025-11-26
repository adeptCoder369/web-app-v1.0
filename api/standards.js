
import axios from "axios";
import { API_BASE_URL } from "../config/server";
import { getCookie } from 'cookies-next';

// ==================================================================================================
export async function getStandardList(profileId, sessionId, guid, id) {
  // ==================================================================================================
  const API_BASE_URL_ = process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL;
  // ==================================================================================================

  try {
    const response = await axios.post(`${API_BASE_URL_}/api`, {
      "api": "standard.getList",
      "guid": "1753099372.5591skt687e2c6c887df4.38959333",
      "logged_in_user_account_id": "885283",
      "user_account_id": "586350",
      "client_id": "547",
      "platform": "ANDROID"
    });

    return response.data;
  } catch (error) {
    console.error('API call error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data. Please try again.');
  }
}
// ==================================================================================================
export async function getStandardLevelList(profileId, sessionId,) {
  // ==================================================================================================
  const API_BASE_URL_ = process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL;
  // ==================================================================================================
  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");

  try {
    const response = await axios.post(`${API_BASE_URL_}/api`, {
      "api": "standardLevel.getList",
      "guid": resolvedGuid,
      logged_in_user_account_id: resolvedUserId,
      user_account_id: profileId,
      client_id: sessionId,
      "platform": "web"
    });

    return response.data;
  } catch (error) {
    console.error('API call error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data. Please try again.');
  }
}
// ==================================================================================================

export async function addStandard(profileId, sessionId, payload) {
  // ==================================================================================================
  const API_BASE_URL_ = process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL;
  // ==================================================================================================
  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");

  try {
    const response = await axios.post(`${API_BASE_URL_}/api`, {
      "api": "standard.add",
      "guid": resolvedGuid,
      logged_in_user_account_id: resolvedUserId,
      user_account_id: profileId,
      client_id: sessionId,
      "platform": "WEB",

      ...payload,

      // "name": "Test Standard",
      // "student_record_id": "58",
      // "min_attendance_percentage": "75",
      // "priority": "20",
      // "session_start_date": "2021-01-11",
      // "session_end_date": "2021-12-11",
      // "standard_level_id": "30"
    });

    return response.data;
  } catch (error) {
    console.error('API call error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data. Please try again.');
  }
}
// ==================================================================================================