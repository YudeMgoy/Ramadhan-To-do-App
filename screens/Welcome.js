import React from 'react';
import {
    Text,
    View,    
    TextInput,
    StyleSheet,
    Dimensions,
    Animated,
    AsyncStorage
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {gradient1,gradient2} from '../utils/colors';

export default class Welcome extends React.Component{
    constructor(props){
        super(props);
        this.showWelcome();
    }

    state={
        wOpacity: new Animated.Value(0),
        nOpacity: new Animated.Value(0),
        nPos: new Animated.Value(-50),
        wPos: new Animated.Value(-50),
        allPos: new Animated.Value(0),
        name: '',
    }

    showWelcome(){
        Animated.timing(this.state.wOpacity,{
            toValue:1,
            duration:1500,
            useNativeDriver: true,
        }).start()

        Animated.timing(this.state.wPos,{
            toValue:0,
            duration:1000,
            useNativeDriver: true,
        }).start(()=>this.showName())    
    }

    showName(){
        Animated.timing(this.state.nOpacity,{
            toValue:1,
            duration:500,
            useNativeDriver: true    
        }).start()

        Animated.timing(this.state.nPos,{
            toValue:0,
            duration:500,
            useNativeDriver: true    
        }).start()
    }

    async hide(){
        await AsyncStorage.setItem('name',this.state.name);
        this.props.getName();
        Animated.timing(this.state.allPos,{
            toValue:-1000,
            duration: 500,
            useNativeDriver: true    
        }).start()
    }

    render(){
        return(
            <Animated.View style={[styles.wContainer,{transform:[{translateX:this.state.allPos}]}]}>
                <LinearGradient colors={[ gradient1,gradient2]} style={[styles.wContainer,{flexDirection:'row'}]}>
                    <Animated.Text style={[styles.welcomeText,{opacity: this.state.wOpacity,transform:[{translateY:this.state.wPos}]}]}>Welcome,</Animated.Text>
                    <Animated.View style={[styles.welcomeTextInput,{marginLeft:0,opacity: this.state.nOpacity,transform:[{translateX:this.state.nPos}]}]}>
                        <TextInput        
                            maxLength={7}  
                            placeholder="What's Your Name?"    
                            placeholderTextColor= "rgba(255,255,255,0.5)"  
                            onSubmitEditing={()=>{this.hide()}}  
                            onChangeText={(name) => this.setState({name})} 
                            style={styles.welcomeTextInput}                   
                        />
                    </Animated.View>                    
                </LinearGradient>
            </Animated.View>
        )
    }
}

const styles = StyleSheet.create({
    wContainer:{
        position: 'absolute',
        flex:1,
        width:Dimensions.get('window').width,   
        height:Dimensions.get('window').height,   
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcomeText:{
        fontFamily: 'Montserrat-Bold',
        color: '#f4f4f4',
        fontSize: 20
    },
    welcomeTextInput:{
        fontSize: 20,
        fontFamily: 'Montserrat-Medium',
        width:220,       
        padding: 10,
        borderRadius: 10,
        marginLeft: -5,
        color: '#f4f4f4'
    }     
})