/**
 * A trivial example of a React Native application
 *
 * @providesModule main
 */
var React = require('react-native');

var {
  View,
  Text,
} = React;

var ExampleApp = React.createClass({
  render() {
    return (
      <View>
        <Text>
          This is an example of a React Native app.
          It is just included here as an example.
          Feel free to try modifying it and seeing what happens!
        </Text>
      </View>
    );
  },
});

AppRegistry.registerComponent('main', () => ExampleApp);
