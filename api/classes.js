import axios from "axios";
import { API_BASE_URL } from "../config/server";
//========================================================================================================
export async function getClassesList(profileId, sessionId, guid, id) {
  //========================================================================================================
  const API_BASE_URL_ = process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL;
  console.log(profileId, sessionId, guid, id);

  //========================================================================================================
  try {
    const response = await axios.post(`${API_BASE_URL_}/api`, {
      "api": "classRoom.getList",
      "guid": guid,
      "logged_in_user_account_id": id,
      "user_account_id": profileId,
      "client_id": sessionId,
      "platform": "web"
    });
    // console.log(' response.data;:',  response);

    return response.data;
  } catch (error) {
    console.error('API call error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data. Please try again.');
  }
}
//========================================================================================================