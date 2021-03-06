'use strict';

const React = require('react-native');
var MovieProject = require('./MovieProject');
const {
  AppRegistry,
  ScrollView,
  StyleSheet,
  PullToRefreshViewAndroid,
  Text,
  TouchableWithoutFeedback,
  View,
} = React;

const styles = StyleSheet.create({
  row: {
    borderColor: 'grey',
    borderWidth: 1,
    padding: 20,
    backgroundColor: '#3a5795',
    margin: 5,
  },
  text: {
    alignSelf: 'center',
    color: '#fff',

  },
  layout: {
    flex: 1,
  },
  scrollview: {
    flex: 1,
  },
});

const Row = React.createClass({
  _onClick: function() {
    this.props.onClick(this.props.data);
  },
  render: function() {
    return (
     <TouchableWithoutFeedback onPress={this._onClick} >
        <View style={styles.row}>
          <Text style={styles.text}>
            {this.props.data.text + ' (' + this.props.data.clicks + ' clicks)'}
          </Text>
        </View>
    </TouchableWithoutFeedback>
    );
  },
});
const PullToRefreshViewAndroidExample = React.createClass({
  statics: {
    title: '<PullToRefreshViewAndroid>',
    description: 'Container that adds pull-to-refresh support to its child view.'
  },
  getInitialState() {
    return {
      isRefreshing: false,
      loaded: 0,
      rowData: Array.from(new Array(20)).map(
        (val, i) => ({text: 'Initial row' + i, clicks: 0})
      ),
    };
  },
  _onClick(row) {
    row.clicks++;
    this.setState({
      rowData: this.state.rowData,
    });
  },

  render() {
    const rows = this.state.rowData.map((row, ii) => {
      return <Row key={ii} data={row} onClick={this._onClick}/>;
    });
    return (
      <PullToRefreshViewAndroid
        style={styles.layout}
        refreshing={this.state.isRefreshing}
        onRefresh={this._onRefresh}
        colors={['red', 'blue']}
        progressBackgroundColor={'pink'}
        >
          <MovieProject />
        // <ScrollView style={styles.scrollview}>
        //   {rows}
        // </ScrollView>
      </PullToRefreshViewAndroid>
    );
  },

  _onRefresh() {
    console.info('--onRefresh--');
    this.setState({isRefreshing: true});
    setTimeout(() => {
      // prepend 10 items
      const rowData = Array.from(new Array(10))
      .map((val, i) => ({
        text: 'Loaded row' + (+this.state.loaded + i),
        clicks: 0,
      }))
      .concat(this.state.rowData);
      console.log(rowData);
      this.setState({
        loaded: this.state.loaded + 10,
        isRefreshing: false,
        rowData: rowData,
      });
    }, 2000);
  },

});

AppRegistry.registerComponent('test2', () => PullToRefreshViewAndroidExample);
