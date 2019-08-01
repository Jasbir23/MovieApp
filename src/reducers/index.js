import { combineReducers } from "redux";
import {
  MOVIES_REQUESTED,
  MOVIES_RECEIVED,
  MOVIES_ERROR,
  SELECTED_MOVIE_REQUESTED,
  SELECTED_MOVIE_RECEIVED,
  SELECTED_MOVIE_ERROR,
  SET_REQUEST_TOKEN,
  SET_SESSION_ID,
  LOGIN_ERROR,
  SET_SELECTED_MOVIE,
  SET_ACCOUNT_ID,
  SET_WATCHLIST,
  ADD_TO_WATCHLIST,
  REMOVE_FROM_WATCHLIST
} from "../actions";

function allMovies(
  state = {
    isFetching: false,
    hasError: false,
    allMovies: [],
    currentPage: 0,
    totalPages: 0
  },
  action
) {
  switch (action.type) {
    case MOVIES_REQUESTED:
      return Object.assign({}, state, {
        isFetching: true
      });
    case MOVIES_RECEIVED:
      return Object.assign({}, state, {
        isFetching: false,
        hasError: false,
        allMovies: state.allMovies.concat(action.movieArray),
        currentPage: action.currentPage,
        totalPages: action.totalPages
      });
    case MOVIES_ERROR:
      return Object.assign({}, state, {
        hasError: true,
        isFetching: false
      });
    default:
      return state;
  }
}

function selectedMovie(
  state = {
    isFetching: false,
    hasError: false,
    selectedMovieId: undefined,
    selectedMovie: undefined
  },
  action
) {
  switch (action.type) {
    case SELECTED_MOVIE_REQUESTED:
      return Object.assign({}, state, {
        isFetching: true
      });
    case SELECTED_MOVIE_RECEIVED:
      return Object.assign({}, state, {
        isFetching: false,
        hasError: false,
        selectedMovie: action.payload
      });
    case SELECTED_MOVIE_ERROR:
      return Object.assign({}, state, {
        hasError: true,
        isFetching: false
      });
    case SET_SELECTED_MOVIE:
      return Object.assign({}, state, {
        selectedMovieId: action.payload
      });
    default:
      return state;
  }
}

function loginStatus(
  state = {
    requestToken: undefined,
    sessionId: undefined,
    accountId: undefined,
    watchlist: [],
    errorMessage: "LOADING"
  },
  action
) {
  switch (action.type) {
    case SET_REQUEST_TOKEN:
      return Object.assign({}, state, {
        requestToken: action.payload,
        errorMessage: ""
      });
    case SET_SESSION_ID:
      return Object.assign({}, state, {
        sessionId: action.payload,
        errorMessage: ""
      });
    case LOGIN_ERROR:
      return Object.assign({}, state, {
        errorMessage: action.payload
      });
    case SET_ACCOUNT_ID:
      return Object.assign({}, state, {
        accountId: action.payload
      });
    case SET_WATCHLIST:
      return Object.assign({}, state, {
        watchlist: action.payload
      });
    case ADD_TO_WATCHLIST:
      return Object.assign({}, state, {
        watchlist: state.watchlist.concat(action.payload)
      });
    case REMOVE_FROM_WATCHLIST:
      const index = state.watchlist.indexOf(action.payload);
      return Object.assign({}, state, {
        watchlist: [
          ...state.watchlist.slice(0, index),
          ...state.watchlist.slice(index + 1)
        ]
      });
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  allMovies,
  selectedMovie,
  loginStatus
});
export default rootReducer;
