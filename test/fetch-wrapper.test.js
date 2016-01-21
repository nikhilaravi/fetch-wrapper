import test from 'tape';
import nock from 'nock';
import { getReq, sendRequest } from '../index.js';

//mock error object sent from own server
const err = {
  status: 'error',
  message: 'Sorry there was a problem'
};

/**
options.onError will only be called if there is an:
- error in the fetch request
- error in options.onSuccess function (e.g. redux error)
**/

test('fetch-wrapper:options.onError => fetch request error calls onError with 500 status code ', t => {

  sendRequest({
    request: getReq('http://ghghjhjkhjhskjhdfkhs.com'),
    responseType: 'json',
    onSuccess: () => {},
    onError: (error) => {
      //status codes sent in error objects to onError function
      t.equal(error.status, 'error');
      t.end()
    },
  });

});

test('fetch-wrapper:options.onError => error in response', t => {

  nock('http://localhost:8000')
    .get('/test')
    .times(2)
    .replyWithError(err)

  sendRequest({
    request: getReq('http://localhost:8000/test'),
    responseType: 'json',
    onSuccess: () => {},
    onError: (error) => {
      t.equal(error.status, 'error');
      t.end();
    }
  });

});


test('fetch-wrapper:options.onError => Error in options.onSuccess handler', t => {

  nock('http://localhost:8000')
    .get('/')
    .reply(200, {name: 'name'})

  sendRequest({
    request: getReq('http://localhost:8000/'),
    responseType: 'json',
    onSuccess: (res) => {
      throw new Error("Error in onSuccess function")
    },
    onError: error => {
      t.equal(error.message, 'Error: Error in onSuccess function');
      t.end();
    }
  });

});


/**
options.onSuccess will be called on
- successful requests
- network errors e.g. 404/
**/

test('fetch-wrapper:options.onSuccess => 404 error calls onSuccess after 1 attempt', t => {

  nock('http://localhost:8000')
    .get('/')
    .times(1)
    .reply(404, err)

  sendRequest({
    request: getReq('http://localhost:8000/'),
    responseType: 'json',
    onSuccess: (json) => {
      t.deepEqual(json, err);
      t.end()
    },
    onError: () => {}
  });

});

test('fetch-wrapper:options.onSuccess => 200 success after 1 attempt', t => {

  nock('http://localhost:8000')
    .get('/login')
    .times(1)
    .reply(200, {name: 'name'})

  sendRequest({
    request: getReq('http://localhost:8000/login'),
    responseType: 'json',
    onSuccess: res => {
      t.deepEqual(res, {name: 'name'});
      t.end();
    },
    onError: () => {}
  });

});

test('fetch-wrapper:options.onSuccess => 500 server error, no error object in response', t => {

  nock('http://localhost:8000')
    .get('/login')
    .times(4)
    .reply(500)

  sendRequest({
    request: getReq('http://localhost:8000/login'),
    responseType: 'json',
    onSuccess: (json) => {
      t.deepEqual(json, {status: 'error', message: 'No response body'});
      t.end()
    },
    onError: () => {}
  });

});

test('fetch-wrapper:options.onSuccess => 500 server error, error object in response', t => {

  nock('http://localhost:8000')
    .get('/server')
    .times(1)
    .reply(500, err)

  sendRequest({
    request: getReq('http://localhost:8000/server'),
    responseType: 'json',
    onSuccess: (json) => {
      t.deepEqual(json, err);
      t.end()
    },
    onError: () => {}
  });

});

test('fetch-wrapper:options.onSuccess => Parse data Error: no response type', t => {

  nock('http://localhost:8000')
    .get('/')
    .times(1)
    .reply(200, {name: 'name'})

  sendRequest({
    request: getReq('http://localhost:8000/'),
    onSuccess: json => {
      t.deepEqual(json, {status: 'error', message: 'Invalid Response Type'});
      t.end();
    },
    onError: () => {}
  });

});

test('fetch-wrapper:options.onSuccess => Parse data Error: invalid response type', t => {

  nock('http://localhost:8000')
    .get('/')
    .times(1)
    .reply(200, {name: 'name'})

  sendRequest({
    request: getReq('http://localhost:8000/'),
    responseType: 'form',
    onSuccess: () => {},
    onSuccess: json => {
      t.deepEqual(json, {status: 'error', message: 'Invalid Response Type'});
      t.end();
    },
    onError: () => {}
  });

});
