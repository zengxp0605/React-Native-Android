'use strict';

var React = require('react-native');
var {
  AppRegistry,
  Text,
  ListView,
  ScrollView,
  View,
  StyleSheet
} = React;
var mockArray = Array(31).join("1").split("").map(function(el,index){
  return 'row '+ (index+1)
});
var PAGE = 1;
//console.log(mockArray);
var AwesomeProject = React.createClass({
  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows(mockArray)
    };
  },
  render: function() {
    return (
        <ListView
        initialListSize={30}
        //pageSize = {10}
        onChangeVisibleRows={()=>{console.log('--onChangeVisibleRows--')}}
        onEndReached={this._onEndReached}
        onEndReachedThreshold={50}
        dataSource={this.state.dataSource}
        renderRow={(rowData) => <Text style={styles.row}>{rowData}</Text>}
        // renderSectionHeader = {this.renderSectionHeader}
          readerHeader={()=><View style={{backgroundColor:'red',height:50}}><Text>Header</Text></View>}
           readerFooter={()=><View style={{backgroundColor:'blue',height:50}}><Text>Footer</Text></View>}
        />
      );
},
renderSectionHeader(){
  return (
  <View style={styles.section}>
    <Text style={styles.sectionText}>Section Header</Text>
  </View>
  );
},
_onEndReached(e){
  PAGE++;
  var appendData = Array(22).join(1).split('').map((el,index)=>{
      return  'page '+ PAGE + ' : row '+ (index+1);
  });
  mockArray = mockArray.concat(appendData);
  console.log(mockArray);
  var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  this.setState({
    dataSource: ds.cloneWithRows(mockArray)
  });
  console.log('--_onEndReached--',e);
}
});
var styles = StyleSheet.create({
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

AppRegistry.registerComponent('test2', () => AwesomeProject);

