
import axios from "axios";
import { API_BASE_URL } from "../config/server";
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