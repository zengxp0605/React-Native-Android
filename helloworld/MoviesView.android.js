'use strict';

var React = require('react-native');

var MOVIES_DATA = [
  {title: 'test1', year: '2015年10月', posters: {thumbnail: 'http://i.imgur.com/UePbdph.jpg'}},
];
var REQUEST_URL = 'https://raw.githubusercontent.com/facebook/react-native/master/docs/MoviesExample.json';

var {
  AppRegistry,
  Image,
  StyleSheet,
  Text,
  View,
  ListView
} = React;

var MoviesView = React.createClass({
  getInitialState: function() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false, // 设置标示位
    };
  },
  //componentDidMount是React组件的一个方法，它会在组件刚加载完成的时候调用一次，以后不再会被调用。
  componentDidMount: function() { 
    this.fetchData();
  },
  fetchData:function(){
  	fetch(REQUEST_URL)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData.movies),
          loaded: true, // 将标示位置为已加载
        });
      })
      .done();
  },
  render:function(){
	if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    //var movie = this.state.movies[0];
    //return this.renderMovie(movie);
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderMovie}
        style={styles.listView}
      />
    );
  },
  renderLoadingView: function() {
    return (
      <View style={styles.container}>
        <Text>
          正在加载电影数据……
        </Text>
      </View>
    );
  },
  renderMovie: function(movie) {
    return (
      <View style={styles.container}>
      	<Image 
     		style={styles.thumb}
     		source={{uri: movie.posters.thumbnail}}
     	/>   
      	<View style={styles.rightContainer}>
     		<Text style={styles.title}>{movie.title}</Text>   
     		<Text style={styles.year}>{movie.year}</Text> 
     	</View>  
      </View>
    );
  }
});

var styles = StyleSheet.create({
   container: {
 	flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  rightContainer: {
    flex: 1,
  },
  thumb: {
    width: 53,
    height: 81,
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  year: {
    textAlign: 'center',
  },
  listView: {
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
  },
});

//AppRegistry.registerComponent('helloworld', () => helloworld);
module.exports = MoviesView;