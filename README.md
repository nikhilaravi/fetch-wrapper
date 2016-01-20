# fetch-wrapper
Wrapper around fetch for resending request if there is an error

##

## Create Request Helpers

Helper Functions that return a function that send a fetch request
The promise returned by fetch is then resolved in the fetch wrapper (fetch-wrapper.js)


## Request wrapper

```js
/**
* Wrapper around the fetch request to retry the request if there is an error
* @param {object} - options
*  - request: function that returns a fetch request. Can be created using the create-request helpers (see create-request.js)
*  - onSuccess(response): function to be called with the response when the fetch request returns successfully
*  - onError(error): function to be called when there is an error in the fetch request
*  - responseType: string ('json' or 'text')
* @param {number} - attempt (defaults to zero)


 TODO:
 - optional timeout parameter to terminate the request

**/
```

## Example usage

```js
/**
  EXAMPLE USAGE

  sendRequest({
    request: postReq('localhost:9009/login', {name: 'name'}), //this should be a function that returns a fetch request
    responseType: 'json'
    onSuccess: json => {},
    onError: (error) => {}
  })
**/
```
