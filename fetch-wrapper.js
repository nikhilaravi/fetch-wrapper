export default function fetchWrapper(options, attempt=0) {
  const onSuccess = options.onSuccess;

  options.request()
    .then(onFetchComplete.bind(null, options), onFetchFail.bind(null, options, attempt)) // catch errors from fetch
    .then(onSuccess, onError.bind(null, options, attempt))
    .catch(onError.bind(null, options, attempt))
}

const retryIntervals = [1000, 2000, 3000]

const onError = (options, attempt, error) => {
  console.log("ON ERROR", error)

  if (error.response && error.response.status) {
    // fetch failure
    onFetchFail(options, attempt, error)
  } else {
    //redux and parsing errors
    const errorMessage = error.toString();
    switch(errorMessage) {
      case 'Error: Invalid Response Type':
        return options.onError('Please specify a responseType property in the options object')
        break;
      default:
        return options.onError('Error in onSuccess function')
    }
  }
}

export const onFetchFail = (options, attempt, error) => {
  if (retryIntervals[attempt]) {
    setTimeout(
      () => fetchWrapper(options, ++attempt),
      retryIntervals[attempt]
    )
  } else {
    // Treat network errors without responses as 500s (internal server error).
    const status = error.response ? error.response.status : 500
    return options.onError(status);
  }
}

export const onFetchComplete = (options,res) => {
  if (res.ok) {
    return parseResponse(options,res);
  } else {
    const error = new Error(res.statusText);
    error.response = res;
    throw error
  }
}

export const parseResponse = (options, res) => {
  const { responseType: type } = options;
  if (type == 'text') {
    return res.text();
  } else if (type == 'json') {
    return res.json();
  } else {
    throw new Error('Invalid Response Type');
  }
}
