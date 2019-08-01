const baseUrl = "https://api.themoviedb.org/3/";
const apiKey = "6abdeb2c02beabd8d6e16d86719aec1b";

export const MOVIES_REQUESTED = "MOVIES_REQUESTED";
export const MOVIES_RECEIVED = "MOVIES_RECEIVED";
export const MOVIES_ERROR = "MOVIES_ERROR";
export const SELECTED_MOVIE_REQUESTED = "SELECTED_MOVIE_REQUESTED";
export const SELECTED_MOVIE_RECEIVED = "SELECTED_MOVIE_RECEIVED";
export const SELECTED_MOVIE_ERROR = "SELECTED_MOVIE_ERROR";
export const SET_REQUEST_TOKEN = "SET_REQUEST_TOKEN";
export const SET_SESSION_ID = "SET_SESSION_ID";
export const SET_ACCOUNT_ID = "SET_ACCOUNT_ID";
export const SET_WATCHLIST = "SET_WATCHLIST";
export const LOGIN_ERROR = "LOGIN_ERROR";
export const SET_SELECTED_MOVIE = "SET_SELECTED_MOVIE";
export const ADD_TO_WATCHLIST = "ADD_TO_WATCHLIST";
export const REMOVE_FROM_WATCHLIST = "REMOVE_FROM_WATCHLIST";

function setRequestToken(requestToken) {
  return {
    type: SET_REQUEST_TOKEN,
    payload: requestToken
  };
}
function setSessionId(sessionId) {
  return {
    type: SET_SESSION_ID,
    payload: sessionId
  };
}
function setAccountId(accountId) {
  return {
    type: SET_ACCOUNT_ID,
    payload: accountId
  };
}
function setWatchlist(watchlist) {
  return {
    type: SET_WATCHLIST,
    payload: watchlist
  };
}
function loginError(errorMessage) {
  return {
    type: LOGIN_ERROR,
    payload: errorMessage
  };
}
function addToWatchlist(movieId) {
  return {
    type: ADD_TO_WATCHLIST,
    payload: movieId
  };
}
function removeFromWatchlist(movieId) {
  return {
    type: REMOVE_FROM_WATCHLIST,
    payload: movieId
  };
}

function addMovies(movieArray, currentPage, totalPages) {
  return {
    type: MOVIES_RECEIVED,
    movieArray,
    currentPage,
    totalPages
  };
}

export function setSelectedMovie(movieId) {
  return {
    type: SET_SELECTED_MOVIE,
    payload: movieId
  };
}

function setMovieDetails(movieJson) {
  return {
    type: SELECTED_MOVIE_RECEIVED,
    payload: movieJson
  };
}
export function getRequestToken() {
  return dispatch => {
    return fetch(`${baseUrl}authentication/token/new?api_key=${apiKey}`)
      .then(response => response.json())
      .then(myJson => {
        return myJson.request_token
          ? dispatch(setRequestToken(myJson.request_token))
          : dispatch(loginError("Error with the API key"));
      })
      .catch(error => {
        console.log(error, "Error in getRequestToken handling");
        dispatch(loginError("Error with the API key"));
      });
  };
}

export function createSessionWithLogin(loginObject) {
  return dispatch => {
    return fetch(
      `${baseUrl}authentication/token/validate_with_login?api_key=${apiKey}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loginObject)
      }
    )
      .then(response => response.json())
      .then(session => {
        return session.success
          ? dispatch(generateSessionId(loginObject.request_token, apiKey))
          : dispatch(loginError("Invalid credentials"));
      })
      .catch(error => {
        console.log(error, "Error in createSessionWithLogin handling");
        dispatch(loginError("Invalid credentials"));
      });
  };
}
function generateSessionId(request_token) {
  return dispatch => {
    return fetch(`${baseUrl}authentication/session/new?api_key=${apiKey}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ request_token })
    })
      .then(response => response.json())
      .then(session => {
        if (session.session_id) {
          dispatch(setSessionId(session.session_id));
          dispatch(getAccountDetails(session.session_id));
        } else {
          dispatch(loginError("Unknown error : Could not generate session"));
        }
      })
      .catch(error => {
        console.log(error, "Error in generateSessionId handling");
        dispatch(loginError("Unknown error : Could not generate session"));
      });
  };
}
function getAccountDetails(sessionId) {
  return dispatch => {
    return fetch(`${baseUrl}account?api_key=${apiKey}&session_id=${sessionId}`)
      .then(response => response.json())
      .then(accountDetails => {
        if (accountDetails.id) {
          dispatch(setAccountId(accountDetails.id));
          dispatch(getWatchList(accountDetails.id, sessionId));
        }
      })
      .catch(error => {
        console.log(error, "Error in getAllMovies handling");
      });
  };
}
function getWatchList(accountId, sessionId) {
  return dispatch => {
    return fetch(
      `${baseUrl}account/${accountId}/watchlist/movies?api_key=${apiKey}&session_id=${sessionId}`
    )
      .then(response => response.json())
      .then(watchlist => {
        if (watchlist.results) {
          let filteredWatchlist = watchlist.results.map(item => item.id);
          dispatch(setWatchlist(filteredWatchlist));
        }
      })
      .catch(error => {
        console.log(error, "Error in getAllMovies handling");
      });
  };
}
export function getAllMovies(pageNumber) {
  return dispatch => {
    return fetch(
      `${baseUrl}movie/upcoming?api_key=${apiKey}&page=${pageNumber}`
    )
      .then(response => response.json())
      .then(movieJson => {
        movieJson.results &&
          dispatch(
            addMovies(movieJson.results, pageNumber, movieJson.total_pages)
          );
      })
      .catch(error => {
        console.log(error, "Error in getAllMovies handling");
      });
  };
}
export function getMovieDetails(movieId) {
  return dispatch => {
    return fetch(`${baseUrl}movie/${movieId}?api_key=${apiKey}`)
      .then(response => response.json())
      .then(movieJson => {
        dispatch(setMovieDetails(movieJson));
      })
      .catch(error => {
        console.log(error, "Error in getMovieDetails handling");
      });
  };
}

export function addMovieToWatchlist(movieId, accountId, sessionId) {
  return dispatch => {
    dispatch(addToWatchlist(movieId));
    return fetch(
      `${baseUrl}account/${accountId}/watchlist?api_key=${apiKey}&session_id=${sessionId}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          media_type: "movie",
          media_id: movieId,
          watchlist: true
        })
      }
    )
      .then(response => response.json())
      .then(watchlistResponse => {
        if (watchlistResponse.status_code !== 1)
          dispatch(removeFromWatchlist(movieId));
      })
      .catch(error => {
        dispatch(removeFromWatchlist(movieId));
      });
  };
}
