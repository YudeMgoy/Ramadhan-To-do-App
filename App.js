import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  AsyncStorage
} from 'react-native';
import Home from './screens/Home';
import Welcome from './screens/Welcome';
import Colors from './utils/colors';

console.disableYellowBox = true;

export default class App extends React.Component {  
  constructor(props){
    super(props);    
    this.getName();               
  }  

  async componentDidMount(){      
    this.checkDay();   
  }

  state = {
    welcome : true,
    name : 'User'
  }

  async checkDay(){
    let day;
    let today = new Date().getDate();

    await AsyncStorage.getItem('today', (error, result) => {
      if(result){
        day = result;
      }else{
        AsyncStorage.removeItem('acts_done');
        AsyncStorage.removeItem('acts_remind');
        AsyncStorage.removeItem('acts');
        AsyncStorage.setItem('today', today.toString())
      }
    })

    if(today.toString() != day){
      await AsyncStorage.removeItem('acts_done');
      await AsyncStorage.removeItem('acts_remind');
      await AsyncStorage.removeItem('acts');
      await AsyncStorage.setItem('today', today.toString())
    }    
  }

  getName = () => {
      AsyncStorage.getItem('name', (error,result) => {
        if(result){           
            this.setState({
              welcome:false,
              name: result
            })
        }else{
          this.setState({welcome:true})
        }
    })
  }

  resetName = async () => {
    await AsyncStorage.removeItem('name');
    this.setState({welcome:true});
  }

  render(){
    return(
      <View style={styles.container}>
        <Colors/>
        <Home name={this.state.name} getName={this.getName} resetName={this.resetName}/>
        {this.state.welcome ? <Welcome getName={this.getName}/> : null}                   
      </View>
        
    )
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1, 
    width: '100%',
    position: 'relative',  
    backgroundColor: 'white',
  }
});