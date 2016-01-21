export default function fetchWrapper(options, attempt=0) {
  const onFetchSuccess  = options.onSuccess;
  const onFetchFail     = onFail.bind(null, options, attempt);
  const onFetchComplete = onComplete.bind(null, options);
  const onError         = handleError.bind(null, options, attempt)

  options.request()
    .then(onFetchComplete, onFetchFail) // catch errors from fetch request
    .then(onFetchSuccess, onError) // catch errors from status codes or parsing data in onFetchComplete
    .catch(onError) // catch errors from onSuccess or parsing data
}

//fetch request fails

//on retry request
//random url
// reponse timeout -

const retryIntervals = [1000]; // time intervals to retry request

export const onFail = (options, attempt, error) => {
  console.log("FETCH ERROR", error.message)
  if (retryIntervals[attempt]) {
    setTimeout(
      () => fetchWrapper(options, ++attempt),
      retryIntervals[attempt]
    )
  } else {
    const status = error.response ? error.response.status : 500; // Treat network errors without responses as 500s (internal server error).
    const message = error.message;
    return options.onError(status, message);
  }
}

export const onComplete = (options,res) => {
  return parseResponse(options,res); // only parse the response if response has status 200
}

export const parseResponse = (options, res) => {
  const { responseType: type } = options;
  if (type == 'text') {
    return res.text();
  } else if (type == 'json') {
    return res.json();
  } else if (type === undefined) {
    throw new Error('Invalid Response Type');
  } else
}

const handleError = (options, attempt, error) => {
  console.log("ON ERROR", error)

  //400/500 error still call onSUccess with the error
  // only call onError after retrying fetch 3 times with fail

  if (error.response && error.response.status) {
    // fetch failure, call Fetch fail function and retry request
    onFail(options, attempt, error)
  } else {
    //redux or parsing error
   return options.onError(error.toString())
  }
}
