'use strict';

var React = require('react-native');

var MOVIES_DATA = [
  {title: 'test1', year: '2015年10月', posters: {thumbnail: 'http://i.imgur.com/UePbdph.jpg'}},
];
var REQUEST_URL = 'https://raw.githubusercontent.com/zengxp0605/test/master/movies/page_1.json';

var {
  AppRegistry,
  Image,
  StyleSheet,
  Text,
  View,
  ListView,
  ScrollView,
  TouchableHighlight
} = React;

var test2 = React.createClass({
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
          responseData:responseData.concat(responseData), // 变成两份
          dataSource: this.state.dataSource.cloneWithRows(responseData),
          loaded: true, // 将标示位置为已加载
        });
      })
      .done();
  },
  render:function(){
	if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return this._testScrollView();
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
  _testScrollView:function(){
    return <ScrollView
        automaticallyAdjustContentInsets={false}
        horizontal={false}
        alwaysBounceVertical={true}
        onScroll={() => { console.log('onScroll!'); }}
        scrollEventThrottle={200}
        style={styles.scrollView}>
        <TouchableHighlight onPress={() => console.log('pressed')}>
          <Text>Proper Touch Handling</Text>
        </TouchableHighlight>
        {this.state.responseData.map(createThumbRow)}
      </ScrollView>
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
     		source={{uri: movie.img}}
     	/>   
      	<View style={styles.rightContainer}>
     		<Text style={styles.title}>{movie.title}</Text>   
     		<Text style={styles.year}>{movie.year}</Text> 
     	</View>  
      </View>
    );
  }
});


var Thumb = React.createClass({
  shouldComponentUpdate: function(nextProps, nextState) {
    return false;
  },
  render: function() {
    return (
      <View style={styles.button}>
        <Text>{this.props.movie.title}</Text>
        <Image style={styles.thumb} source={{uri:this.props.movie.img}} />
      </View>
    );
  }
});

var createThumbRow = (data, i) => <Thumb key={i} movie={data} />;

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
  scrollView:{
    backgroundColor:'#abcdef',
    height:300,
  },
  button: {
    margin: 7,
    padding: 5,
    alignItems: 'center',
    backgroundColor: '#eaeaea',
    borderRadius: 3,
  },
});

AppRegistry.registerComponent('test2', () => test2);
