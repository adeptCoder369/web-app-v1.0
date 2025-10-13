import axios from 'axios';
import httpClient from '../services/httpClient';
import { API_BASE_URL } from '../config/server';
import { getCookie } from 'cookies-next';


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
  id,
  page,
  limit

}) => {

  let resolvedGuid = guid ?? getCookie("guid");
  let resolvedUserId = getCookie("id");



  // console.log('======== getFee ==========',

  //   profileId,
  //   sessionId,
  //   guid,
  //   id,
  //   resolvedGuid,
  //   resolvedUserId
  // );

  return axios.post(`${API_BASE_URL}/api`, {
    "api": "fee.getList",
    "guid": resolvedGuid,
    logged_in_user_account_id: resolvedUserId,
    user_account_id: profileId,
    client_id: sessionId,
    "platform": "web",
    page,
    limit
  });
};


//========================================================================================================

export const getFeeTypeDetail = async (
  profileId,
  sessionId,
  feeTypeId
) => {

  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");



  // console.log('======== getFee ==========',

  //   profileId,
  //   sessionId,
  //   guid,
  //   id,
  //   resolvedGuid,
  //   resolvedUserId
  // );

  return axios.post(`${API_BASE_URL}/api`, {
    "api": "fee.getDetails",
    "guid": resolvedGuid,
    logged_in_user_account_id: resolvedUserId,
    user_account_id: profileId,
    client_id: sessionId,
    "platform": "web",
    "id": feeTypeId

  });
};




//========================================================================================================

export const postFee = async (
  profileId,
  sessionId,
  payload
) => {

  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");



  console.log('======== payload ==========', profileId, payload);

  return axios.post(`${API_BASE_URL}/api`,
    {
      "api": "fee.add",
      "guid": resolvedGuid,
      "logged_in_user_account_id": resolvedUserId,
      "user_account_id": profileId,
      "client_id": sessionId,
      "platform": "WEB",



      ...payload


      // "standard_ids": [
      //   "7435",
      //   "7436",
      //   "7437"
      // ],
      // "name": "Demo Fee",
      // "serial_number": "22",
      // "is_miscellaneous": "0",
      // "type": "HALF YEARLY",
      // "start_date": "2021-01-01",
      // "end_date": "2021-06-30",
      // "due_date": "2021-07-07",
      // "include_transport_fee": "1",
      // "is_online_payment_allowed": "1",
      // "number_of_months": "6",
      // "transport_fee_multiplier": "1",
      // "is_partial_payment_allowed": "1",
      // "is_disabled": "0",
      // "is_adjustment_amount_applicable": "1",
      // "show_break_up_on_receipt": "1",
      // "fee_types_amount": [
      //   {
      //     "fee_type_id": "445",
      //     "amount": "2.00"
      //   },
      //   {
      //     "fee_type_id": "446",
      //     "amount": "100.00"
      //   },
      //   {
      //     "fee_type_id": "447",
      //     "amount": "0"
      //   }
      // ]
    }


  );
};



//========================================================================================================

export const updateFeePermission = async (
  profileId,
  sessionId,
  payload
) => {

  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");

    console.log("resps -------------->", payload);



  return axios.post(`${API_BASE_URL}/api`,
    {
      "api": "client.setOnlinePaymentPermission",
      "guid": resolvedGuid,
      "logged_in_user_account_id": resolvedUserId,
      "user_account_id": profileId,
      "client_id": sessionId,
      "platform": "WEB",



      ...payload


    }


  );
};


//========================================================================================================

export const getFeeCollection = async ({
  profileId,
  sessionId,
  guid,
  id,
  payload

}) => {


  // console.log('====================================== payload : ', payload);

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
  payload

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


//========================================================================================================

export const getFeeNameWiseSummary = async ({
  profileId,
  sessionId,
  guid,
  id,
  payload

}) => {



  return axios.post(`${API_BASE_URL}/api`, {
    "api": "client.getFeeNameWiseSummary",
    "guid": "1758272216.8501skt68cd1ad8cf8976.28502279",
    "logged_in_user_account_id": "885283",
    "user_account_id": "558664",
    "client_id": "2200",
    "platform": "WEB"
  });
};



