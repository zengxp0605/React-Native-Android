'use strict';

var React = require('react-native');
var {
  AppRegistry,
  Text,
  Image,
  ListView,
  View,
  StyleSheet,
  PullToRefreshViewAndroid,
  ToolbarAndroid,
  DrawerLayoutAndroid,
  TouchableHighlight,
  ToastAndroid
} = React;

// url 模板,每次替换页码
var REQUEST_URL_TPL = 'https://raw.githubusercontent.com/zengxp0605/test/master/movies/page_{page}.json';
var PAGE = 22; // start page
var globalArry = [];

var DRAWER_REF = 'drawer';
var DRAWER_WIDTH_LEFT = 156
var toolbarActions = [
  {title: '提醒', icon: require('image!ic_message_white'), show: 'always'},
  {title: '夜间模式', show: 'never'},
  {title: '设置选项', show: 'never'},
];

var MovieProject = React.createClass({
  getInitialState: function() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loadStatus: 'start', // 设置标示位
      isToTopRefreshing: false, // 
      theme:null
    };
  },  
  componentDidMount: function() {// 初始化页面后,加载第一页
    this.loadNewPage();
  },
  loadNewPage:function(){
    this.setState({loadStatus: 'loading'}); // 显示加载中
    var page_url = REQUEST_URL_TPL.replace('{page}',PAGE);
    console.info('Wating for next page, Fetching from: ' + page_url);
    let _loadStatus = 'loadmore';
    let that = this;
    fetch(page_url)
      .then(function(rsp){
        if(!rsp.ok){
          if(rsp.status =='404'){
             that.setState({
              loadStatus: 'end', // 将标示位置为已加载完毕
            });
            throw new Error('加载完毕!');
          }
          throw new Error('Code:'+ rsp.status + ' ' + rsp._bodyText);
        }
        return rsp.json();
      })
      .then((rspData) => {
        console.info('Get Page ' + PAGE,rspData);
        globalArry = globalArry.concat(rspData);
        PAGE++;
        that.setState({
          dataSource: this.state.dataSource.cloneWithRows(globalArry),
          loadStatus: _loadStatus, // 将标示位置为已加载
          isToTopRefreshing: false, // 取消顶部正在加载图标
        });
      })
      //.done();
      .catch((e) => {
        ToastAndroid.show(e.message, ToastAndroid.LONG);
        console.error("Oops, error", e)
      });
  },
  render: function() {
    let _loadTips = 'Load more...',
      _onEndReached = this.loadNewPage,
      _onPressLoadMore = this._onPressLoadMore;
    if (this.state.loadStatus === 'start') {
      return this.renderLoadingView();
    }else if(this.state.loadStatus ==='end'){ // 加载完毕,隐藏 'Load more'
      _loadTips = 'end';
      _onEndReached = null;
      _onPressLoadMore = null;
    }else if(this.state.loadStatus ==='loading'){
      _loadTips = 'loading......';
    }
    return (
       <DrawerLayoutAndroid
        ref={DRAWER_REF}
        drawerWidth={React.Dimensions.get('window').width - DRAWER_WIDTH_LEFT}
        keyboardDismissMode="on-drag"
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={this._renderNavigationView}>
         <View style={{flex:1}}>
           <ToolbarAndroid
              //navIcon={require('image!ic_menu_white')}
              navIcon={{uri:'https://raw.githubusercontent.com/zengxp0605/test/master/ic_menu_white.png'}}
              title='首页'
              titleColor="white"
              style={styles.toolbar}
              actions={toolbarActions}
              onIconClicked={() => this.refs[DRAWER_REF].openDrawer()}
              //onActionSelected={this.onActionSelected} 
              />

                <PullToRefreshViewAndroid
                  style={{flex: 1}}
                  refreshing={this.state.isToTopRefreshing}
                  onRefresh={this._onPullTopRefresh}
                  colors={['#99CCFF', '#CCCC33','#33FF99']}
                  progressBackgroundColor={'rgba(0,0,0,0.6)'}
                  >
                      <ListView
                        initialListSize={30}
                        pageSize = {10}
                        onChangeVisibleRows={()=>{console.log('--onChangeVisibleRows--')}}
                        onEndReached={_onEndReached} // 每次滚动到底部时,加载下一页数据
                        onEndReachedThreshold={20}
                        style={styles.listView}
                        dataSource={this.state.dataSource}
                        renderRow={(rowData) => <MovieView movie={rowData} />}
                        //renderHeader ={()=><View style={{backgroundColor:'pink',height:20}}><Text style={{textAlign:'center'}}>--Header--</Text></View>}
                        renderFooter ={()=><LoadMoreTestView testPress={_onPressLoadMore} tips={_loadTips} />}
                        //renderSectionHeader = {this.renderSectionHeader}
                      />
                </PullToRefreshViewAndroid>
          </View>
        </DrawerLayoutAndroid>  
      );
  },
  readerHeader(){
    console.log('readerHeader');
    return (
      <View style={{backgroundColor:'red',flex:1,height:20}}>
        <Text>----Header-----</Text>
      </View>
    );
  },
  _onPressLoadMore(){
    ToastAndroid.show('Loading more...', ToastAndroid.SHORT);
    this.loadNewPage();
  },
  _onPullTopRefresh() {
    console.info('--_onPullTopRefresh--');
    globalArry = [];
    PAGE = 1;
    this.loadNewPage();
    this.setState({
      isToTopRefreshing: true,
    });
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
  onSelectTheme: function(theme) {
    console.info('---onSelectTheme--');
    this.refs[DRAWER_REF].closeDrawer();
    this.setState({theme: theme});
  },
  _renderNavigationView: function() {
    return (
      <ThemesList onSelectItem={this.onSelectTheme} />
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


var ThemesList = React.createClass({
  getInitialState: function() {
    var dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    return {
      dataSource: dataSource,
    };
  },
  componentDidMount: function() {
    console.log('componentDidMount ThemesList');
    let themes = [{'name':'test'}];
     this.setState({
          dataSource: this.state.dataSource.cloneWithRows(themes),
      });
  },
  renderHeader: function() {
    var TouchableElement = TouchableHighlight;
    // if (React.Platform.OS === 'android') {
    //   TouchableElement = React.TouchableNativeFeedback;
    // }
    return(
      <View style={{flex: 1,flexDirection: 'column'}}>
        <View style={{flex: 1,backgroundColor: '#00a2ed'}}>
          <TouchableElement>
            <View style={{flexDirection: 'row', alignItems: 'center', padding: 16}}>
              <Image
                //source={require('image!comment_avatar')}
                style={{width: 40, height: 40, marginLeft: 8, marginRight: 8}} />
              <Text style={styles.menuText}>
                请登录
              </Text>
            </View>
          </TouchableElement>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableElement>
              <View style={styles.menuContainer}>
                <Image
                  //source={require('image!ic_favorites_white')}
                  style={{width: 30, height: 30}} />
                <Text style={styles.menuText}>
                  我的收藏
                </Text>
              </View>
            </TouchableElement>
            <TouchableElement>
              <View style={styles.menuContainer}>
              <Image
                //source={require('image!ic_download_white')}
                style={{width: 30, height: 30}} />
                <Text style={styles.menuText}>
                  离线下载
                </Text>
              </View>
            </TouchableElement>
          </View>
        </View>
        <TouchableElement onPress={() => this.props.onSelectItem(null)}>
          <View style={styles.themeItem}>
            <Image
              //source={require('image!home')}
              style={{width: 30, height: 30, marginLeft: 10}} />
            <Text style={styles.homeTheme}>
              首页
            </Text>
          </View>
        </TouchableElement>
      </View>
    );
  },
  renderRow: function(
    theme: Object,
    sectionID: number | string,
    rowID: number | string,
    highlightRowFunc: (sectionID: ?number | string, rowID: ?number | string) => void,
  ) {
    var TouchableElement = TouchableHighlight;
    return (
      <View>
        <TouchableElement
          onPress={() => this.props.onSelectItem(theme)}
          onShowUnderlay={highlightRowFunc}
          onHideUnderlay={highlightRowFunc}>
          <View style={{flex:1}}>
            <Text style={{color:'pink'}}>
              {theme.name}
            </Text>
          </View>
        </TouchableElement>
      </View>
    );
  },
  render: function() {
    return (
      <View style={{flex:1}}>
        <ListView
          ref="themeslistview"
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          automaticallyAdjustContentInsets={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps={true}
          showsVerticalScrollIndicator={false}
          renderHeader={this.renderHeader}
          style={{flex:1, backgroundColor: 'white'}}
        />
      </View>
    );
  },
});

var LoadMoreTestView = React.createClass({
  render(){
    return (
        <View style={styles.loadMore}>
           <TouchableHighlight onPress={this.props.testPress}> 
             <Text style={{textAlign:'center'}}>{this.props.tips}</Text>
           </TouchableHighlight>
        </View> 
    );
  }
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
    paddingLeft: 10,
  },
   toolbar: {
    backgroundColor: '#00a2ed',
    height: 56,
  },
  rightContainer: {
    flex: 1,
  },
  listView: {
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
  },
  loadMore:{
    backgroundColor:'rgba(0,0,0,0.04)',
    height:30,
    paddingTop:5,
    borderTopColor:'rgba(0,0,0,0.08)',
    borderTopWidth:1,
  },
/*----test-----*/
menuContainer: {
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  menuText: {
    fontSize: 14,
    color: 'white',
  },
  homeTheme: {
    fontSize: 16,
    marginLeft: 16,
    color: '#00a2ed'
  },
  themeItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },

});

AppRegistry.registerComponent('helloworld', () => MovieProject);

