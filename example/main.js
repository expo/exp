/**
 * A trivial example of a React Native application
 */
var React = require('react-native');

var {
  AppRegistry,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} = React;

class ExampleApp extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>E X P O N E N T</Text>
        <Text style={styles.paragraph}>
          This is a simple example of what you can build with Exponent and React Native.
          Feel free to try modifying it and seeing what happens!
        </Text>
        <ScrollView style={[styles.scrollView, {
            justifyContent: 'center',
            flexDirection: 'row',
            marginTop: 15,
        }]}>
          <Text>This text is within a scroll view</Text>
          <Image
            source={{uri: 'http://ccheever.com/Duckling.png'}}
            style={{
              // N.B. Images must be explicitly sized or they default to a zero-size
              // This is not the web!
              height: 400,
              width: 244,
              borderColor: '#ccccee',
              borderRadius: 8.0,
              borderWidth: 1.0,
            }}
            />
          <Text>... as is this duckie!</Text>
        </ScrollView>
        <Text style={styles.paragraph}>E-mail exponent.team@gmail.com with feedback or questions!</Text>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'green',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  contentContainer: {
    justifyContent: 'flex-start',
  },
  textContainer: {
    marginHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '300',
    marginBottom: 4,
    justifyContent: 'flex-end',
    color: '#cccccc',
  },
  paragraph: {
    fontSize: 16,
    marginTop: 8,
    color: 'white',
  },
  scrollView: {
    backgroundColor: 'white',
    marginHorizontal: 30,
    marginVertical: 10,
  },
});

AppRegistry.registerComponent('main', () => ExampleApp);
