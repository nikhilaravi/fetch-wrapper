# fetch-wrapper
Wrapper around fetch for resending request if there is an error

##

## Create Request Helpers

Helper Functions that return a function that send a fetch request
The promise returned by fetch is then resolved in the fetch wrapper (fetch-wrapper.js)


## Request wrapper

/**
* Wrapper around the fetch request to retry the request if there is an error
* @param {object} - options
*  - request: function that returns a fetch request. Can be created using the create-request helpers (see create-request.js)
*  - onSuccess(response): function to be called with the response when the fetch request returns successfully
*  - onError(error): function to be called when there is an error in the fetch request
*  - responseType: string ('json' or 'text')
* @param {number} - attempt (defaults to zero)
**/

/**
.then(onSuccess, onFail)
.catch(onError)
- When the fetch promise is resolved with a fetch response,
and the onSuccess handler throws an exception while handling the response,
the onFail function is not invoked, but the catch handler is
- use the onFail function to deal with fetch network errors, and use the catch handler to deal with rendering errors

/**
* Error handling for fetch request
*
* If the number of attempts is less that the number of retryIntervals
* the request is sent again
* @param {object} - request options object
* @param {number} - attempt
* @param {string} - error from fetch request
*
**/


 TODO:
 - optional timeout parameter to terminate the request
**/

/**
* If there is an error in the fetch request
* it is re-sent at the intervals defined below.
**/



## Example usage
