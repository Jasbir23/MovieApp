import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  TouchableOpacity
} from "react-native";
import { StackActions, NavigationActions } from "react-navigation";
import { connect } from "react-redux";
import { getRequestToken, createSessionWithLogin } from "../../actions";

const { width } = Dimensions.get("window");

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }
  componentDidMount() {
    this.props.dispatch(getRequestToken());
  }
  render() {
    const { requestToken, errorMessage } = this.props.loginStatus;
    return (
      <View style={styles.container}>
        <Text>LOGIN</Text>
        <TextInput
          style={styles.input}
          placeholder={"Username"}
          onChangeText={username => this.setState({ username })}
          value={this.state.username}
        />
        <TextInput
          style={styles.input}
          placeholder={"Password"}
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <TouchableOpacity
          style={styles.subButton}
          disabled={
            requestToken &&
            this.state.username !== "" &&
            this.state.password !== ""
              ? false
              : true
          }
          onPress={() =>
            this.props
              .dispatch(
                createSessionWithLogin({
                  username: this.state.username,
                  password: this.state.password,
                  request_token: requestToken
                })
              )
              .then(() => {
                this.props.loginStatus.sessionId &&
                  this.props.navigation.dispatch(
                    StackActions.reset({
                      index: 0,
                      actions: [
                        NavigationActions.navigate({ routeName: "MovieList" })
                      ]
                    })
                  );
              })
          }
        >
          <Text style={styles.subButtonText}>
            {requestToken ? "SUBMIT" : "LOADING..."}
          </Text>
        </TouchableOpacity>
        <Text style={styles.infoMessage}>{errorMessage}</Text>
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
  input: {
    height: 40,
    width: width - 100,
    borderColor: "gray",
    borderWidth: 1,
    marginVertical: 10
  },
  subButton: {
    backgroundColor: "black",
    height: 40,
    width: width - 100,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  subButtonText: {
    color: "white"
  },
  infoMessage: {
    color: "red"
  }
});

const mapStateToProps = state => {
  return {
    loginStatus: state.loginStatus
  };
};

export default connect(mapStateToProps)(Login);
