# fetch-wrapper
Wrapper around isomorphic-fetch for resending fetch request if there is an error.

[![NPM](https://nodei.co/npm-dl/fetch-wrapper.png?months=3)](https://nodei.co/npm/fetch-wrapper/)

## Getting Started

- [Installation](#installation)
- [Request Wrapper](#request-wrapper)
- [Request Creator Helpers](#request-creator-helpers)
- [Example Usage](#example-usage)
- [Credits](#credits)

### Installation

```bash
$ npm i fetch-wrapper --save

```

To run the tests first clone the repo:

```bash
$ git clone https://github.com/nikhilaravi/fetch-wrapper.git

```

Run the tests:

```bash
$ npm test

```

## Request wrapper

The `sendRequest` function retries the fetch request if there is an error.

| Param  | Default  | Type | Description |
| :------------ |:---------------:| :---------------:| :-----|
| options | `{}` |`object` | REQUIRED: Object specifying the request, onSuccess and onError functions. See below |
| retryIntervals | `[1000]` |`array of numbers` | OPTIONAL: Time intervals at which to retry the fetch request |
| attempt | `0` |`number` | Do not need to specify |

### options object

| Key | Type | Description |
| :------------ |:---------------:| :---------------:| :-----|
| request |`function` | function returns a fetch request. Can be created using the create-request helpers (see create-request.js) |
| responseType | enum (`text`,`json`) | Format of the response. Used to parse the response body using either 'response.text' or 'response.json' methods |
| onSuccess(response) |`function` | function to be called with the response when the fetch request returns successfully |
| onError(response) |`function` | function to be called when there is an error in the fetch request  |

`options.onError` will only be called if there is an:
- error in the fetch request
- error in options.onSuccess function (e.g. redux error)

The error object passed to onError is of the form
```js
{
  status: '', //either a status code or 'error'
  message: ''
}
```

`options.onSuccess` will be called on
- successful requests
- network errors e.g. 404/500

The response passed to onSuccess is either the response data (json/text) or in the case of a network/server/parsing error, an error object of the form
```js
{
  status: '', //'error'
  message: '' // e.g. 'Invalid Response Type' or 'No response body'
}
```

## Request Creator Helpers

Helper functions that return a function that send a fetch request
The promise returned by fetch is then resolved inside the `sendRequest` function.

Options available for sending get, post and put requests with and without authentication.

The parameters for each helper are outline below in the order they need to be specified.

### getReq
| Param  | Default  | Type | Description |
| :------------ |:---------------:| :---------------:| :-----|
| url | `undefined` |`string` | url of the request |
| header | `{}` |`object` | Optional header options |


### postReq
| Param  | Default  | Type | Description |
| :------------ |:---------------:| :---------------:| :-----|
| url | `undefined` |`string` | url of the request |
| data | `null` |`object` | request body which will be stringified |
| header | `{}` |`object` | Optional header options |

### putReq
| Param  | Default  | Type | Description |
| :------------ |:---------------:| :---------------:| :-----|
| url | `undefined` |`string` | url of the request |
| data | `null` |`object` | request body which will be stringified |
| header | `{}` |`object` | Optional header options |

### getAuthReq
| Param  | Default  | Type | Description |
| :------------ |:---------------:| :---------------:| :-----|
| url | `undefined` |`string` | url of the request |
| token | `undefined` |`string` | Authentication token which will be set to the 'Authorization' key in the request header object |
| header | `{}` |`object` | Optional further header options |

### postAuthReq
| Param  | Default  | Type | Description |
| :------------ |:---------------:| :---------------:| :-----|
| url | `undefined` |`string` | url of the request |
| data | `null` |`object` | request body which will be stringified |
| token | `undefined` |`string` | Authentication token which will be set to the 'Authorization' key in the request header object |
| header | `{}` |`object` | Optional further header options |

### putAuthReq
| Param  | Default  | Type | Description |
| :------------ |:---------------:| :---------------:| :-----|
| url | `undefined` |`string` | url of the request |
| data | `null` |`object` | request body which will be stringified |
| token | `undefined` |`string` | Authentication token which will be set to the 'Authorization' key in the request header object |
| header | `{}` |`object` | Optional further header options |

## Example usage

```js
import { postReq, sendRequest } from 'fetch-wrapper'

sendRequest({
  request: postReq('http://localhost:9009/login', {name: 'name'}), //this should be a function that returns a fetch request
  responseType: 'json'
  onSuccess: json => { //on success code here },
  onError: error => { //on error code here }
})

```

## Credits
Collaborators: @besartshyti
