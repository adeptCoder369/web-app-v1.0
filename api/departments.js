import axios from 'axios';
import httpClient from '../services/httpClient';
import { API_BASE_URL } from '../config/server';
import { getCookie } from 'cookies-next';


//========================================================================================================
export const getDepartments = async (
  profileId,
  sessionId,

) => {

  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");


  const requestBody = {
    "api": "department.getList",
    guid: resolvedGuid,
    logged_in_user_account_id: resolvedUserId,
    user_account_id: profileId,
    client_id: sessionId,
    platform: "web",
    "version_code": "1.2.4",


  };


  return axios.post(`${API_BASE_URL}/api`, requestBody);


};
//========================================================================================================
export const addDepartments = async (
  profileId,
  sessionId,
  payload

) => {

  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");

  console.log('products__', payload);

  const requestBody = {
    "api": "department.add",
    guid: resolvedGuid,
    logged_in_user_account_id: resolvedUserId,
    user_account_id: profileId,
    client_id: sessionId,

    name: payload?.name,
    description: payload?.description,
    product_ids: payload?.productId,
    "platform": "web"



  };


  return axios.post(`${API_BASE_URL}/api`, requestBody);


};
//========================================================================================================

export const editDepartments = async (
  profileId,
  sessionId,
  payload

) => {

  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");

  console.log('products__', payload);

  const requestBody = {
    "api": "department.add",
    guid: resolvedGuid,
    logged_in_user_account_id: resolvedUserId,
    user_account_id: profileId,
    client_id: sessionId,

    name: payload?.name,
    description: payload?.description,
    product_ids: payload?.productId,
    "platform": "web"



  };


  return axios.post(`${API_BASE_URL}/api`, requestBody);


};
//========================================================================================================
