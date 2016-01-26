'use strict';

var React = require('react-native');
var MoviesView = require('./MoviesView');

var {
　　AppRegistry,
	DrawerLayoutAndroid,
	ToolbarAndroid,
　　View,
　　Navigator,
　　Text,
　　BackAndroid,
　　StyleSheet,

} = React;

var SampleApp = React.createClass({
    configureScene(route){
     return Navigator.SceneConfigs.FadeAndroid;
    },
    renderScene(router, navigator){
      var Component = null;
      this._navigator = navigator;
      switch(router.name){
        case "welcome":
          Component = WelcomeView;
          break;
        case "test":
          Component = TestView;
          break;
        case "movies":
          Component = MoviesView;
          break;
        default: //default view
          Component = DefaultView;
      }
      return <Component title={router.name} navigator={navigator} />
    },

    componentDidMount() {
      // var navigator = this._navigator;
      // BackAndroid.addEventListener('hardwareBackPress', function() {
      //     if (navigator && navigator.getCurrentRoutes().length > 1) {
      //       navigator.pop();
      //       return true;
      //     }
      //     return false;
      // });
    },

    componentWillUnmount() {
      // BackAndroid.removeEventListener('hardwareBackPress');
    },

    render() {
        return (
            <Navigator
                initialRoute={{name: 'welcome'}}
                configureScene={this.configureScene}
                renderScene={this.renderScene} />
        );
    }

});

var WelcomeView = React.createClass({
    onPressFeed() {
        this.props.navigator.push({name: 'test'});
    },
    onPressMovies() {
        this.props.navigator.push({name: 'movies'});
    },
    goBack(){
      this.props.navigator.push({name:"default"});
    },
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome} onPress={this.onPressFeed} >
                    This is welcome view.Tap to go to test view.
                </Text>
                <Text style={styles.welcome} onPress={this.onPressMovies} >
                    ---- Tap to movies list.
                </Text>
                 <Text style={styles.welcome} onPress={this.goBack} >
                    Tab to default view!
                </Text>
            </View>
        );
    }

});

var DefaultView = React.createClass({
 	configureScene(route){
		return Navigator.SceneConfigs.FloatFromRight;
	},
    render(){
      return (
          <View style={styles.container}>
              <Text style={styles.welcome}>Default view</Text>
          </View>
      )
    }
});


var TestView = React.createClass({
    render() {
      var navigationView = (
	    <View style={{flex: 1, backgroundColor: '#fff'}}>
	      <Text style={{margin: 10, fontSize: 15, textAlign: 'left'}}>I'm in the Drawer!</Text>
	    </View>
	  );
	  return (
	    <DrawerLayoutAndroid
	      drawerWidth={300}
	      drawerPosition={DrawerLayoutAndroid.positions.Right}
	      renderNavigationView={() => navigationView}>
	      <View style={{flex: 1, alignItems: 'center'}}>
	        <Text style={{margin: 10, fontSize: 15, textAlign: 'right'}}>Hello</Text>
	        <Text style={{margin: 10, fontSize: 15, textAlign: 'right'}}>World!</Text>
	      </View>
	    </DrawerLayoutAndroid>
	  );
    }
});


var styles = StyleSheet.create({
	container:{
		flex:1,
		justifyContent:'center',
		alignItems:'center',
		backgroundColor:'#f5fcff',
	},
	welcome:{
		fontSize:30,
		textAlign:'center',
		margin:10,
	},
	instructions:{
		textAlign:'center',
		color:'#333333',
		marginBottom:5,
	},

});


AppRegistry.registerComponent('helloworld', () => TestView);
