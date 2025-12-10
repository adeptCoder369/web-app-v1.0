import axios from 'axios';
import httpClient from '../services/httpClient';
import { API_BASE_URL } from '../config/server';
import { getCookie } from 'cookies-next';


//========================================================================================================

export const getParentsList = async (
  profileId,
  sessionId,
  page,
  limit
) => {

  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");





  return axios.post(`${API_BASE_URL}/api`, {
    "api": "studentParent.getList",
    "guid": resolvedGuid,
    logged_in_user_account_id: resolvedUserId,
    user_account_id: profileId,
    client_id: sessionId,
    "platform": "web",
    "version_code": "1.2.4",

    page,
    limit
  });
};
//========================================================================================================

export const addParents = async (
  profileId,
  sessionId,
  payload
) => {

  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");





  return axios.post(`${API_BASE_URL}/api`, {
    "api": "studentParent.add",
    "guid": resolvedGuid,
    logged_in_user_account_id: resolvedUserId,
    user_account_id: profileId,
    client_id: sessionId,
    "platform": "web",
    "version_code": "1.2.4",



    "name": payload?.name,
    "date_of_birth": payload?.date_of_birth,
    "gender": payload?.gender,
    "blood_group": payload?.blood_group,
    "aadhaar_number": payload?.aadhaar_number,
    "emails": payload?.emails,
    "phones": payload?.phones,
    "address": payload?.address,
    "locality": payload?.locality,
    "landmark": payload?.landmark,
    "city": payload?.city,
    "state_id": payload?.state_id,
  });
};


//========================================================================================================

export const updateParents = async (
  profileId,
  sessionId,

  payload
) => {
        // console.log('payload===', payload);

  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");





  return axios.post(`${API_BASE_URL}/api`, {
    "api": "studentParent.edit",

    "guid": resolvedGuid,
    logged_in_user_account_id: resolvedUserId,
    user_account_id: profileId,
    client_id: sessionId,
    "platform": "web",
    "version_code": "1.2.4",

    "id": payload?.id,


    "name": payload?.name,
    "date_of_birth": payload?.date_of_birth,
    "gender": payload?.gender,
    "blood_group": payload?.blood_group,
    "aadhaar_number": payload?.aadhaar_number,
    "emails": payload?.emails,
    "phones": payload?.phones,
    "address": payload?.address,
    "locality": payload?.locality,
    "landmark": payload?.landmark,
    "city": payload?.city,
    "state_id": payload?.state_id,
  });
};


