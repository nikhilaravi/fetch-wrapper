 /**

 FETCH REQUEST WRAPPER

 TODO:
 - optional timeout parameter to terminate the request
**/

/**
* If there is an error in the fetch request
* it is re-sent at the intervals defined below.
**/

const retryIntervals = [
  1000,
  2000,
  3000,
  4000,
  5000,
]

/**
* Wrapper around the fetch request to retry the request if there is an error
* @param {object} - options
*  - request: function that returns a fetch request. Can be created using the create-request helpers (see create-request.js)
*  - onSuccess(response): function to be called with the response when the fetch request returns successfully
*  - onError(error): function to be called when there is an error in the fetch request
*  - responseType: string ('json' or 'text')
* @param {number} - attempt (defaults to zero)
**/

export default function fetchWrapper(options, attempt=0) {
  options.request()
    .then(res => onComplete(res, options))
    .then(data => {
       try { options.onSuccess(data) }
       catch(e) { console.log("ERROR in your onSuccess function", e) }
    })
    .catch(onError.bind(null, options, attempt))
}

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

export const onError = (options, attempt, error) => {
    console.log("ERROR")
  if (retryIntervals[attempt]) {
    setTimeout(
      () => fetchWrapper(options, ++attempt),
      retryIntervals[attempt]
    )
  } else {
    return options.onError(error);
  }
}

export const onComplete = (res, options) => {
  console.log("COMPLETE");
  if (res.status == 200 && res.ok) {
    const { responseType: type } = options;
    if (type == 'text') {
      return res.text();
    } else if (type == 'json') {
      return res.json();
    } else {
      throw new Error('Invalid Response Type');
    }
  }
  else throw new Error('status code not 200 and not ok');
}
