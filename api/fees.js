import axios from 'axios';
import httpClient from '../services/httpClient';
import { API_BASE_URL } from '../config/server';


//========================================================================================================

export const getStudentFee = async ({
  studentId,
  profileId,
  sessionId,
  guid,
  id, }) => {
  // console.log('======== studetnFeesData ==========',
  //   studentId,
  //   profileId,
  //   sessionId,
  //   guid,
  //   id,);

  return axios.post(`${API_BASE_URL}/api`, {
    api: 'student.getFees',
    id: studentId,
    guid: guid,
    logged_in_user_account_id: id,
    user_account_id: profileId,
    client_id: sessionId,
    platform: 'android',
    version_code: '1.1.3.19'
  });
};

//========================================================================================================

export const getFee = async ({
  profileId,
  sessionId,
  guid,
  id, }) => {
  // console.log('======== studetnFeesData ==========',

  //   profileId,
  //   sessionId,
  //   guid,
  //   id,);

  return axios.post(`${API_BASE_URL}/api`, {
    "api": "fee.getList",
    "guid": guid,
    logged_in_user_account_id: id,
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
