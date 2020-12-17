import * as  React from 'react';
import { StyleSheet, Text, View,Image } from 'react-native';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import BookTransactionScreen from './screens/BookTransactionScreen';
import SearchScreen from './screens/SearchScreen'; 
import LoginScreen from './screens/LoginScreen';


export default class App extends React.Component{
    render(){
      return(
        <AppContainer/>
      )
    }
}

const TabNavigator = createBottomTabNavigator({
  Transaction : {screen:BookTransactionScreen},
  Search : {screen : SearchScreen}
},
{
defaultNavigationOptions : ({navigation}) => ({
  tabBarIcon : ({}) => {
    const routeName = navigation.state.routeName
    if(routeName === 'Transaction'){
      return(
        <Image
        source = {require('./assets/book.png')}
        style = {{
          width : 30,
          height : 30
        }}
        />
      )
    } 
    else if(routeName === 'Search'){
      return(
        <Image
        source = {require('./assets/searchingbook.png')}
        style = {{
          width : 30,
          height : 30
        }}
        />
      )
    }
  }
})
})

const SwitchNavigator = createSwitchNavigator({
   LoginScreen : {screen : LoginScreen},
   TabNavigator : {screen : TabNavigator}  
})

const AppContainer = createAppContainer(SwitchNavigator)