import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Dimensions,
    Animated,
    TouchableOpacity,
    Picker,
    TouchableWithoutFeedback,
    AsyncStorage
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {primaryColor} from '../utils/colors';

export default class AddActivity extends React.Component{
    constructor(props){
        super(props);           
    }

    state={
        showPos: new Animated.Value(1000),
        show: this.props.showAdd,

        actName: '',
        actCategory: 'Sport',
        actPlace:'',
        actTime: new Date,
        getActs: "[]"
    }    

    componentDidUpdate(){      
        if(this.state.show != this.props.showAdd){
            Animated.timing(this.state.showPos,{
                toValue: 0,
                duration: 600,
                useNativeDriver: true    
            }).start();
            this.setState({show:this.props.showAdd})
        }        
    }

    hideAdd(){        
        Animated.timing(this.state.showPos,{
            toValue: 1000,
            duration: 600,
            useNativeDriver: true    
        }).start();
    }    

    async submitAdd(){
        await AsyncStorage.getItem('acts', (error,result) => {
            if(result){
                this.setState({getActs:result});            
            } 
        });

        let act = {            
                name: this.state.actName,
                category: this.state.actCategory,
                place: this.state.actPlace,
                time: this.state.actTime,
                remind: false,
                done: false,
                box: 'box'
        }
        
        let acts = JSON.parse(this.state.getActs);
        acts.push(act);
        await AsyncStorage.setItem('acts',JSON.stringify(acts));    
        this.props.getActs();      
        this.hideAdd();        
    }

    render(){        
        return(
            <Animated.View style={[styles.container, {transform:[{translateX:this.state.showPos}]}]}>
                <TouchableOpacity
                        style={[styles.closeButton, {backgroundColor: primaryColor}]}
                        onPress={()=>{this.hideAdd()}}
                    >
                    <Text style={{fontFamily:'Montserrat-Medium', color: 'white',fontSize: 15}}>X</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Add Activity</Text>
                <View style={styles.activityBox}>
                    <TextInput
                        style={styles.input}
                        placeholder='Activity Name'
                        onChangeText={(actName)=>{this.setState({actName})}}
                    ></TextInput>
                    <View style={[styles.input,{padding:0}]}>
                        <Picker
                            selectedValue={this.state.actCategory}
                            style={[styles.input,{marginVertical:0}]}
                            itemStyle={styles.input}    
                            onValueChange={(actCategory) => {this.setState({actCategory})}}          
                        >
                            <Picker.Item label="Sport" value="Sport"/>
                            <Picker.Item label="Business" value="Business"/>
                            <Picker.Item label="School" value="School"/>
                            <Picker.Item label="Social" value="Social"/>
                            <Picker.Item label="Other" value="Other"/>
                        </Picker>
                    </View>                    
                    <TextInput
                        style={styles.input}
                        placeholder='Place'
                        onChangeText={(actPlace)=>{this.setState({actPlace})}}
                    ></TextInput>                    
                    <DatePicker
                        date={this.state.actTime}
                        onDateChange={(actTime) => {this.setState({actTime})}} 
                        locale="id-ID"      
                        mode="time"                 
                    />
                    <TouchableOpacity
                        style={[styles.submitButton,{backgroundColor: primaryColor}]}
                        onPress={() => {this.submitAdd()}}
                    >
                        <Text style={{fontFamily:'Montserrat-Medium', color: 'white',fontSize: 24}}>+</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: 'white',
        position:'absolute',
        padding: 30,
        paddingTop: 80
    },
    title:{
        fontFamily:'Montserrat-Medium',
        fontSize: 18,
        color: '#666',
        marginBottom: 10
    },
    input:{
        marginVertical: 7,
        color: '#888',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#aaa',
        padding:10,
        borderRadius: 10
    },
    submitButton:{
        borderRadius: 50,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: (Dimensions.get('window').width/2)-40,
        bottom: -70,
        elevation:5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.8,
        shadowRadius: 5,      
        zIndex:99999         
    },  
    closeButton:{
        borderRadius: 50,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        right: 30,
        top: 30,
        elevation:5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.8,
        shadowRadius: 5,      
        zIndex:99999        
    },
})