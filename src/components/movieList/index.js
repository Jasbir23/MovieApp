import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  FlatList,
  TextInput
} from "react-native";
import { connect } from "react-redux";
import { getAllMovies, setSelectedMovie } from "../../actions";

const { width } = Dimensions.get("window");

class MovieList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      queryText: ""
    };
  }
  componentDidMount() {
    this.props.dispatch(getAllMovies(1));
    this.readyForEndReach = false;
  }
  handleEndReached(currentPage, totalPages) {
    if (
      currentPage < totalPages &&
      this.readyForEndReach &&
      this.state.queryText === ""
    ) {
      this.props.dispatch(getAllMovies(currentPage + 1));
      this.readyForEndReach = false;
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder={"Search movies here"}
          onChangeText={queryText => this.setState({ queryText })}
          value={this.state.queryText}
        />
        <FlatList
          data={this.props.moviesData.allMovies.filter(movie =>
            movie.title.startsWith(this.state.queryText)
          )}
          keyExtractor={(item, index) => index.toString()}
          onScroll={() => (this.readyForEndReach = true)}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => {
                this.props.dispatch(setSelectedMovie(item.id));
                this.props.navigation.navigate("MovieDetails");
              }}
            >
              <Text style={styles.listText}>{item.title}</Text>
              {this.props.watchlist &&
                this.props.watchlist.includes(item.id) && (
                  <Text style={styles.watchlistText}>WATCHLISTED</Text>
                )}
            </TouchableOpacity>
          )}
          onEndReached={() =>
            this.handleEndReached(
              this.props.moviesData.currentPage,
              this.props.moviesData.totalPages
            )
          }
          onEndReachedThreshold={0.1}
        />
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
  listItem: {
    height: 60,
    width: width,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center"
  },
  listText: {
    color: "white"
  },
  watchlistText: {
    color: "white",
    backgroundColor: "green",
    marginHorizontal: 5
  },
  input: {
    height: 60,
    width: width,
    fontSize: 20,
    paddingHorizontal: 20
  }
});
const mapStateToProps = state => {
  return {
    moviesData: state.allMovies,
    watchlist: state.loginStatus.watchlist
  };
};
export default connect(mapStateToProps)(MovieList);
