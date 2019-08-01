import React, { Component } from "react";
import { connect } from "react-redux";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import { getMovieDetails, addMovieToWatchlist } from "../../actions";

class MovieDetails extends Component {
  componentDidMount() {
    this.props.dispatch(
      getMovieDetails(this.props.movieDetails.selectedMovieId)
    );
  }
  render() {
    const isWatchlisted = this.props.watchlist.includes(
      this.props.movieDetails.selectedMovieId
    );
    return (
      <View style={styles.container}>
        <Text>MOVIE DETAILS</Text>
        {this.props.movieDetails.selectedMovie && (
          <View>
            <Text>{this.props.movieDetails.selectedMovie.title}</Text>
            <Text>{this.props.movieDetails.selectedMovie.overview}</Text>
            <TouchableOpacity
              style={styles.watchlistButton}
              disabled={isWatchlisted}
              onPress={() =>
                this.props.dispatch(
                  addMovieToWatchlist(
                    this.props.movieDetails.selectedMovieId,
                    this.props.accountId,
                    this.props.sessionId
                  )
                )
              }
            >
              <Text>{isWatchlisted ? "Watchlisted" : "Watchlist"}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  watchlistButton: {
    height: 40,
    width: 100,
    marginVertical: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green"
  }
});
const mapStateToProps = state => {
  return {
    movieDetails: state.selectedMovie,
    watchlist: state.loginStatus.watchlist,
    accountId: state.loginStatus.accountId,
    sessionId: state.loginStatus.sessionId
  };
};
export default connect(mapStateToProps)(MovieDetails);
