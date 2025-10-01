// utils/api/dashboard.js

import axios from "axios";
import { API_BASE_URL } from "../config/server";


//========================================================================================================

export const getAttendanceList = async (
  profile,
  session,
  selectedDate,
  cookyGuid,
  selectedClassId,
  cookyId,) => {

  console.log('here it comes -----------', profile,
    session,
    selectedDate,
    cookyGuid,
    selectedClassId,
    cookyId,);


  return axios.post(`${API_BASE_URL}/api`, {
    "api": "classRoom.getAttendance",
    "id": selectedClassId,
    "date": selectedDate,
    "guid": cookyGuid,
    "logged_in_user_account_id": cookyId,
    "user_account_id": profile,
    "client_id": session,
    "platform": "WEB",
    "version_code": "1.1.1.17"
  });
};
//========================================================================================================
export const markAttendance = async (
  profile,
  session,
  selectedDate,
  cookyGuid,
  selectedClassId,
  cookyId,) => {



  return axios.post(`${API_BASE_URL}/api`, {
    "api": "classRoom.markAttendance",
    "guid": cookyGuid,
    "logged_in_user_account_id": "885283",
    "user_account_id": profile,
    "client_id": session,
    "platform": "WEB",
    "id": selectedClassId,
    "date": selectedDate,
    "is_updated": true,
    "attendance": {
      "PRESENT": [
        1060369
      ],
      "ABSENT": [],
      "LEAVE": []
    }
  });
};
//========================================================================================================

export const getAttendanceReportApi = async (
  profile,
  session,
  selectedDate,
  cookyGuid,
  selectedClassId,
  cookyId,) => {

  console.log('here it comes sdsd-----------', profile,
    session,
    selectedDate,
    cookyGuid,
    selectedClassId,
    cookyId,);


  return axios.post(`${API_BASE_URL}/api`, {
       "api": "client.getDailyAttendanceReport",
    "id": "2200",
    // "date": "Invalid date",
    "date": "2025-06-25", //yy-mm-dd

    "guid": "1750757322.5798skt685a6fca8d8df7.03992324",
    "logged_in_user_account_id": "885283",
    "user_account_id": "558664",
    "client_id": "2200",
    "platform": "android",
    "version_code": "1.0.14"
  });
};