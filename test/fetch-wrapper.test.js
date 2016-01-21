import test from 'tape';
import nock from 'nock';
import { getReq, sendRequest } from '../index.js';

const err = {
  status: 'error',
  message: 'Sorry there was a problem'
};

test('fetch-wrapper => 404 error after 4 attempts (3 retry intervals)', t => {

  nock('http://localhost:8000')
    .get('/')
    .times(4)
    .reply(404)

  sendRequest({
    request: getReq('http://localhost:8000/'),
    responseType: 'json',
    onSuccess: () => {},
    onError: error => {
      t.equal(error, 404);
      t.end()
    }
  });

});

test('fetch-wrapper => 200 success', t => {

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

test('fetch-wrapper => 500 server error', t => {

  nock('http://localhost:8000')
    .get('/login')
    .times(4)
    .reply(500)

  sendRequest({
    request: getReq('http://localhost:8000/login'),
    responseType: 'json',
    onSuccess: () => {},
    onError: (error) => {
      t.equal(error, 500);
      t.end();
    }
  });

});

test('fetch-wrapper => reply error', t => {

  nock('http://localhost:8000')
    .get('/login')
    .times(4)
    .replyWithError(err)

  sendRequest({
    request: getReq('http://localhost:8000/login'),
    responseType: 'json',
    onSuccess: () => {},
    onError: (error) => {
      console.log("REPLY ERROR", error)
      t.equal(error, 500);
      t.end();
    }
  });

});

test('fetch-wrapper => 200 success on third request attempt', t => {

  nock('http://localhost:8000').get('/ok').once().reply(400);
  nock('http://localhost:8000').get('/ok').twice().reply(400);
  nock('http://localhost:8000').get('/ok').thrice().reply(200, 'ok');

  sendRequest({
    request: getReq('http://localhost:8000/ok'),
    responseType: 'text',
    onSuccess: res => {
      t.equal(res, 'ok');
      t.end();
    },
    onError: () => {}
  });

});

test('fetch-wrapper => Parse data Error: no response type', t => {

  nock('http://localhost:8000')
    .get('/')
    .times(1)
    .reply(200, {name: 'name'})

  sendRequest({
    request: getReq('http://localhost:8000/'),
    onSuccess: () => {},
    onError: error => {
      t.equal(error, 'Please specify a responseType property in the options object');
      t.end();
    }
  });

});

test('fetch-wrapper => Error in options.onSuccess handler', t => {

  nock('http://localhost:8000')
    .get('/')
    .reply(200, {name: 'name'})

  sendRequest({
    request: getReq('http://localhost:8000/'),
    responseType: 'json',
    onSuccess: (res) => {
      throw new Error("on success error")
    },
    onError: error => {
      t.equal(error, 'Error in onSuccess function');
      t.end();
    }
  });

});
