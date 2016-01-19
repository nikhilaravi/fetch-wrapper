import * as requestHelpers from './request-creator-helpers.js';
import fetchWrapper        from './fetch-wrapper.js';

export const postReq     = requestHelpers.postReq;
export const getReq      = requestHelpers.getReq;
export const putReq      = requestHelpers.putReq;
export const postAuthReq = requestHelpers.postAuthReq;
export const putAuthReq  = requestHelpers.putAuthReq;
export const getAuthReq  = requestHelpers.getAuthReq;
export const sendRequest = fetchWrapper;

/**
EXAMPLE USAGE

sendRequest({
  request: postReq('localhost:9009/login', {name: 'name'}), //this should be a function that returns a fetch request
  responseType: 'json'
  onSuccess: json => {},
  onError: (error) => {}
})
**/
