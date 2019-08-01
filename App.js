import React, { Component } from "react";
import { Provider } from "react-redux";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import { createStore, applyMiddleware } from "redux";
import { createStackNavigator, createAppContainer } from "react-navigation";

import MovieList from "./src/components/movieList";
import MovieDetails from "./src/components/movieDetails";
import Login from "./src/components/login";
import allReducers from "./src/reducers";

const RootStack = createStackNavigator({
  Login: Login,
  MovieList: MovieList,
  MovieDetails: MovieDetails
});

const Navigation = createAppContainer(RootStack);

const loggerMiddleware = createLogger();

const store = createStore(
  allReducers,
  applyMiddleware(
    thunkMiddleware, // thunk for async functions to get dispatch function
    loggerMiddleware // logging middleware
  )
);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Navigation />
      </Provider>
    );
  }
}
