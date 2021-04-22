/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TextInput, Button, Alert, Keyboard, AsyncStorage, ActivityIndicator} from 'react-native';
import ListView from 'deprecated-react-native-listview';
import Header from './components/Header';
import Row from './components/Row';
import Footer from './components/Footer';
// import console = require('console');

const filterItems=(filter, items)=>{
  return items.filter(items=>{
    if(filter==="ALL") return true;
    if(filter==="COMPLETED") return items.complete;
    if(filter==="ACTIVE") return !items.complete;
  })
}

export default class App extends Component {
  constructor(props){
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1,r2)=> r1 !== r2});
    this.state= {
      value: '',
      items: [],
      allComplete: false,
      dataSource: ds.cloneWithRows([]),
      filter: "ALL",
      loading: true,
    }
    // this.handleToggleAllComplete=this.handleToggleAllComplete.bind(this)
  }
  componentWillMount(){
    AsyncStorage.getItem("items").then(json=>{
      try{
        const items = JSON.parse(json)
        this.setSource(items, items, {loading: false})
      } catch(e){
        console.log(e)
        this.setState({loading: false})
      }
    })
            // this.setState({loading: false})
  }
  setSource=(items, itemsDataSource, otherState={})=>{
    const { dataSource } = this.state;
    this.setState({
      items,
      dataSource: dataSource.cloneWithRows(itemsDataSource),
      ...otherState
    })
    AsyncStorage.setItem("items", JSON.stringify(items))
  }
  handleAddItem=()=>{
    const {value, items, filter} = this.state;
    if(!value) return;
    const newItems=[
      ...items,
      {
        key: Date.now(),
        text: value,
        complete: false,
      }
    ]
    this.setSource(newItems, filterItems(filter, newItems), {value: ""})
  }
  handleToggleAllComplete=()=>{ 
    // console.log("REACHED")
    const {allComplete, items, filter} = this.state;
    const complete = !allComplete;
    const newItems = items.map(item => ({
      ...item,
      complete
    }))
    // console.log("newItems: ",newItems)
    this.setSource(newItems, filterItems(filter, newItems), {allComplete:complete})
  }
  handleToggleComplete=(key, complete)=>{
    const { items, filter } = this.state;
    const newItems = items.map(item=>{
      if (item.key !== key) return item;
      return {
        ...item,
        complete
      }
    });
    this.setSource(newItems, filterItems(filter, newItems))
  }
  handleRemove=(key)=>{
    const { items, filter } = this.state;
    const newItems = items.filter(item=>item.key !==key)
    this.setSource(newItems, filterItems(filter, newItems));
  }
  handleFilter=(filter)=>{
    console.log(filter)
    const { items } = this.state;
    this.setSource(items, filterItems(filter, items), {filter})
  }
  handleClearComplete=()=>{
    const { items, filter } = this.state;
    const newItems = filterItems("ACTIVE", items);
    console.log(newItems, filter, filterItems(filter, newItems))
    this.setSource(newItems, filterItems(filter, newItems))
  }
  handleUpdateText=(key, text)=>{
    const { items, filter } = this.state;
    const newItems = items.map(item=>{
      if(item.key !== key) return item;
      return {
        ...item,
        text
      }
    })
    this.setSource(newItems, filterItems(filter, newItems))
  }
  handleToggleEditing=(key, editing)=>{
    const { items, filter } = this.state;
    const newItems = items.map(item=>{
      if(item.key !== key) return item;
      return {
        ...item,
        editing
      }
    })
    this.setSource(newItems, filterItems(filter, newItems))
  }
  render() {
    console.log('hey-oo');
    const {value, items, dataSource, filter, loading} = this.state;
    console.log(dataSource)
    const { handleAddItem, handleToggleAllComplete, handleToggleComplete, handleRemove, handleFilter, handleClearComplete, handleUpdateText, handleToggleEditing }= this;
    return (
      <View style={styles.container}>
        <Header 
          value={value}
          onAddItem={()=>handleAddItem()}
          onChange={(value)=>this.setState({value})}
          onToggleAllComplete={()=>handleToggleAllComplete()}
        />
        
        <View style={styles.content}>
          <ListView 
            style={styles.list}
            enableEmptySections
            dataSource={dataSource}
            onScroll={()=>Keyboard.dismiss()}
            renderRow={({key, ...value})=>{
              return(
                <Row
                  key={key}
                  onComplete={(complete)=>handleToggleComplete(key, complete)}
                  onRemove={()=>handleRemove(key)}
                  onUpdate={(text)=>handleUpdateText(key, text)}
                  onToggleEdit={(editing)=>handleToggleEditing(key, editing)}
                  {...value}//key and value are from the properties of each item (object) in dataSource 
                  value={value}
                />
              )
            }}
            renderSeparator={(sectionId, rowId)=> {
              return <View style={styles.separator} key={rowId} />
              
            }}
          />
        </View>
        <Footer
          count={filterItems("ACTIVE", items).length}
          filter={filter}
          onFilter={(x)=>handleFilter(x)}
          onClearComplete={()=>handleClearComplete()}
        />
        {
          loading && 
          <ActivityIndicator
            style={styles.loading} 
            animating
            size="large"
          />
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    ...Platform.select({
      android: {
        paddingTop: 30
      }
    }),
  },
  content: {
    flex: 1,
  },
  list: {
    backgroundColor: '#FFF',
  },
  separator: {
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  loading: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, .2)'
  },
});
