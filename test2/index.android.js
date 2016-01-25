'use strict';

var React = require('react-native');
var {
  AppRegistry,
  Text,
  Image,
  ListView,
  ScrollView,
  View,
  StyleSheet,
  PullToRefreshViewAndroid,
  ProgressBarAndroid,
  TouchableOpacity,
} = React;

// url 模板,每次替换页码
var REQUEST_URL_TPL = 'https://raw.githubusercontent.com/zengxp0605/test/master/movies/page_{page}.json';
var PAGE = 1; // start page
var globalArry = [];

var HEAD_REF = "header";
var MovieProject = React.createClass({
  getInitialState: function() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false, // 设置标示位
      isToTopRefreshing: false, // 
      tmpHeaderBgColor:'rgba(0,0,0,0.2)',
    };
  },
  componentDidMount: function() {// 初始化页面后,第一次加载数据
  	console.log('componentDidMount');
    this.loadNewPage();
  },
  loadNewPage:function(){
    var page_url = REQUEST_URL_TPL.replace('{page}',PAGE);
    console.info('Wating for next page, Fetching from: ' + page_url);
    fetch(page_url)
      .then(function(rsp){
        if(!rsp.ok)
             throw new error('Code:'+ rsp.status + ' ' + rsp._bodyText);
         return rsp.json();
      })
      .then((rspData) => {
        console.info('Get Page ' + PAGE,rspData,globalArry);
        globalArry = globalArry.concat(rspData);
        PAGE++;
        // TODO 这里应该设置底部的'加载中'提示
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(globalArry),
          loaded: true, // 将标示位置为已加载
          isToTopRefreshing: false, // 取消顶部正在加载图标
        });
      })
      .catch(e => console.error("Oops, error", e))
  },
  render: function() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
      <View style={{flex:1,paddingTop:50}} ref={HEAD_REF}>
      	<Text ref="test" style={styles.row} children="test111"></Text>
      <PullToRefreshViewAndroid
        style={{flex: 1}}
        refreshing={this.state.isToTopRefreshing}
        onRefresh={this._onPullTopRefresh}
        colors={['red', 'blue']}
        progressBackgroundColor={'pink'}

        >
      
            <ListView
            initialListSize={30}
            //pageSize = {10}
            onChangeVisibleRows={()=>{console.log('--onChangeVisibleRows--')}}
            onEndReached={this.loadNewPage} // 每次滚动到底部时,加载下一页数据
            onEndReachedThreshold={0}
            style={styles.listView}
            dataSource={this.state.dataSource}
            renderRow={(rowData) => <MovieView movie={rowData} />}
            // renderSectionHeader = {this.renderSectionHeader}
              renderHeader={this.renderHeader}
               renderFooter={()=><View style={{backgroundColor:'blue',height:50}}><Text>Footer</Text></View>}
            />
      </PullToRefreshViewAndroid>
      </View>
      );
  },
  renderHeader(){
  	return (
	<View style={{backgroundColor:this.state.tmpHeaderBgColor,height:50,justifyContent:'center'}}>
		<TouchableOpacity onPress={this._onPressHeader}>
			<Text ref="test2">---Header---</Text>
		</TouchableOpacity>
	</View>
	);
  },
  _onPressHeader(){
  	this.refs[HEAD_REF].setNativeProps({style:{paddingTop:10}});
  	this.refs["test"].setNativeProps({children:'ttttttttttttttttstt',style:{backgroundColor:'red'}});
  	console.log('_onPressHeader',this.refs["test"],this.refs["test2"]);
  },
  _onPullTopRefresh() {
    console.info('--_onPullTopRefresh--');
    globalArry = [];
    PAGE = 1;
    this.loadNewPage();
    this.setState({
      isToTopRefreshing: true,
      // dataSource: this.state.dataSource.cloneWithRows(),
    });
    // setTimeout(() => {
    //   // prepend 10 items
    //   const rowData = Array.from(new Array(10))
    //   .map((val, i) => ({
    //     text: 'Loaded row' + (+this.state.loaded + i),
    //     clicks: 0,
    //   }))
    //   .concat(this.state.rowData);
    //   console.log(rowData);
    //   this.setState({
    //     loaded: this.state.loaded + 10,
    //     isRefreshing: false,
    //     rowData: rowData,
    //   });
    // }, 2000);
  },
  renderLoadingView: function() {
  	return (
		<View style={styles.loadingContainer}>
		        <ProgressBarAndroid 
		          //style={{height: 40}}
		          color="#337ab7"
		          styleAttr="LargeInverse" //"Large" //"Inverse"
		        />
      </View>
  	);
  },
  renderSectionHeader(){
    return (
    <View style={styles.section}>
      <Text style={styles.sectionText}>Section Header</Text>
    </View>
    );
  },
});

var MovieView = React.createClass({
  shouldComponentUpdate: function(nextProps, nextState) {
    return false;
  },
  render: function() {
    var movie = this.props.movie;
    return (
      // <View style={styles.button}>
      //   <Text>{this.props.movie.title}</Text>
      //   <Image style={styles.thumb} source={{uri:this.props.movie.img}} />
      // </View>
      <View style={styles.container}>
        <Image 
          style={styles.thumb}
          source={{uri: movie.img}}
        />   
        <View style={styles.rightContainer}>
           <Text style={styles.title}>{movie.title}</Text> 
           <View style={{flexDirection:'row',paddingLeft:50}}>  
              <Text style={styles.score}>{movie.score}分</Text> 
              <Text style={styles.year}>{movie.year}年</Text> 
           </View>  
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
    marginBottom:5,
  },
  loadingContainer:{
	flex: 1,
	justifyContent: 'center',
	alignItems: 'center',
	backgroundColor:'#ebf9ff',
  },
  rightContainer: {
    flex: 1,
  },
  listView: {
    padding: 20,
    backgroundColor: '#F5FCFF',
  },
  thumb: {
    width: 53,
    height: 81,
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    marginLeft:30,
    //textAlign: 'center',
    // backgroundColor:'pink',
  },
  score:{
    color:'blue',
   // backgroundColor:'yellow',
    textAlign:'center',
  },
  year: {
    //backgroundColor:'gray',
    textAlign: 'center',
    paddingLeft:50,
  },
  row:{
    textAlign: 'center',
    lineHeight: 30,
    fontSize: 16,
    backgroundColor:'#51c9d2',
    marginTop: 2,
  },
  section:{
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 6,
    backgroundColor: '#2196F3',
  },
  sectionText:{
    color: 'white',
    paddingHorizontal: 8,
    fontSize: 16,
  }
});

AppRegistry.registerComponent('test2', () => MovieProject);

