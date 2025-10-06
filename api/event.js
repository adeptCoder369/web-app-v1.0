import axios from 'axios';
import httpClient from '../services/httpClient';
import { API_BASE_URL } from '../config/server';
import { getCookie } from 'cookies-next';


//========================================================================================================

export const getEvents = async ({
  profileId,
  sessionId,
  guid,
  id, }) => {

  let resolvedGuid = guid ?? getCookie("guid");
  let resolvedUserId = getCookie("id");



  console.log('======== getFee ==========',

    profileId,
    sessionId,
    guid,
    id,
    resolvedGuid,
    resolvedUserId
  );

  return axios.post(`${API_BASE_URL}/api`, {
    "api": "fee.getList",
    "guid": resolvedGuid,
    logged_in_user_account_id: resolvedUserId,
    user_account_id: profileId,
    client_id: sessionId,
    "platform": "web"
  });
};




//========================================================================================================

export const getFeeCollection = async ({
  profileId,
  sessionId,
  guid,
  id,
  payload

}) => {


  console.log('====================================== payload : ', payload);

  return axios.post(`${API_BASE_URL}/api`, {
    "api": "client.getFeeCollections",
    "guid": guid,
    logged_in_user_account_id: id,
    user_account_id: profileId,
    client_id: sessionId,
    "platform": "web",
    "id": sessionId,
    "mode": payload.mode,
    "class_ids": payload.class_ids,
    "is_promoted_student": payload.is_promoted_student,
    "is_new_student": payload.is_new_student,
    "only_deposited": payload.only_deposited,
    "deposit_start_date": payload.depositStartDate,
    "deposit_end_date": payload.depositEndDate,

  });
};





//========================================================================================================

export const getFeeCollectionSummary = async ({
  profileId,
  sessionId,
  guid,
  id,
  payloa

}) => {



  return axios.post(`${API_BASE_URL}/api`, {
    "api": "client.getFeeCollectionSummary",
    "guid": "1758272216.8501skt68cd1ad8cf8976.28502279",
    "logged_in_user_account_id": "885283",
    "user_account_id": "558664",
    "client_id": "2200",
    "id": "2200",
    "platform": "WEB"
  });
};
