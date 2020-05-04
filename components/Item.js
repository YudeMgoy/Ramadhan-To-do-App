import React from 'react';
import{
    View,
    Text,
    TouchableWithoutFeedback,
    StyleSheet,
    Image,
    TouchableOpacity,
    Animated,
    AsyncStorage    
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ReactNativeAN from 'react-native-alarm-notification';

import Sport from '../assets/images/arm_icon.png';
import School from '../assets/images/school_icon.png';
import Business from '../assets/images/bag_icon.png';
import Other from '../assets/images/other_icon.png';
import Social from '../assets/images/social_icon.png';
import {primaryColor,gradient1,gradient2} from '../utils/colors';

export default class Item extends React.Component{
    constructor(props){
        super(props);    
        this.getDone();
        this.getRemind();   
    }    
    

    state = {
        slide: new Animated.Value(250),
        show: false  ,
        time: new Date(this.props.time),     
        getDone: "",
        dones: '',
        done:'',
        getRemind: "",
        reminds: '',
        remind: ''   
    }      

    async setDone(){
        await AsyncStorage.getItem('acts_done', (error,result) => {
            if(result){
                this.setState({getDone:result});            
            } 
        });

        let done = this.state.getDone.split(',');         
        var thereIsId = false;
        
        for(var i = 0; i<done.length;i++){            
            if(parseInt(done[i]) === this.props.id){
                thereIsId = true;
                done.splice(i,1);    
                i--;            
            }
        }        
        
        if(thereIsId == false){
            done[done.length] = this.props.id;
        }
        
        await AsyncStorage.setItem('acts_done',done.toString());
        this.getDone();
        this.props.getDone();
    }    

    async getDone(){
        await AsyncStorage.getItem("acts_done", (error, result) => {
            if(result){
                this.setState({dones:result});
            }
        });        

        this.setState({done:false});

        let dones = this.state.dones.split(',');    
        if(dones.length < 2){
            AsyncStorage.setItem('acts_done', ",");
        }

        for(var i=0;i<dones.length;i++){
            if(parseInt(dones[i]) === this.props.id){
                this.setState({done:true})
            }
        }
    }

    async setRemind(){
        console.log(this.props.name);
        await AsyncStorage.getItem('acts_remind', (error,result) => {
            if(result){
                this.setState({getRemind:result});            
            } 
        });        

        let remind = this.state.getRemind.split(',');         
        var thereIsId = false;
        
        for(var i = 0; i<remind.length;i++){                        
            if(parseInt(remind[i]) === this.props.id){
                thereIsId = true;
                remind.splice(i,1);
            }            
        }          
        
        if(thereIsId == false){
            remind[remind.length] = this.props.id;
            let fireDate = ReactNativeAN.parseDate(new Date(this.props.time));
            let notifData = {
                alarm_id: (this.props.id).toString(),
                title: "Activity Todo!",
                message: this.props.name,
                vibrate: true,
                play_sound: true,
                schedule_type: "once",
                channel: "wakeup",
                data: { content: "Activity Todo: "+this.props.name },
                loop_sound: true,
                color: primaryColor,
                small_icon: "ic_launcher"
            }
            this.props.setAlarm(notifData, fireDate);
        }else{
            await ReactNativeAN.deleteAlarm((this.props.id).toString());
        }    
        await AsyncStorage.setItem('acts_remind',remind.toString());        
        this.getRemind();
    }

    async getRemind(){        
        await AsyncStorage.getItem("acts_remind", (error, result) => {
            if(result){
                this.setState({reminds:result});
            }
        });        

        this.setState({remind:false});
        
        let reminds = this.state.reminds.split(',');    
        if(reminds.length < 2){
            AsyncStorage.setItem('acts_remind', ",");
        }

        for(var i=0;i<reminds.length;i++){
            if(parseInt(reminds[i]) === this.props.id){
                this.setState({remind:true})
            }
        }        
    }

    slideShow(){
        Animated.timing(this.state.slide,{
            toValue:10,
            duration: 200,    
            useNativeDriver: true        
        }).start();

        this.setState({
            show: true
        })
    }

    slideHide(){
        Animated.timing(this.state.slide,{
            toValue:250,
            duration: 200,
            useNativeDriver: true
        }).start();

        this.setState({
            show: false
        })
    }

    render(){
        return(
            <View style={styles.container}>
                <View style={styles.itemBox}>
                    <TouchableWithoutFeedback style={styles.tWF} onPress={()=>{this.state.show ? this.slideHide() : this.slideShow()}}>                                     
                        <View style={this.props.last ? styles.lastBox : styles.box}>
                            {this.props.last ? <View style={styles.whiteBorder}></View> : null}
                            <View style={styles.iconBox}>
                                <Image style={styles.iconImage} source={
                                    this.props.category == "Sport" ? Sport : 
                                    this.props.category == "Other" ? Other :
                                    this.props.category == "Business" ? Business :
                                    this.props.category == "Social" ? Social :
                                    School
                                }></Image>
                            </View>                        
                            <View style={styles.row}>
                                <Text style={styles.title}>
                                    {this.props.name}
                                </Text>
                                <Text style={styles.time}>
                                    {/* 17 sampai 23 dikurangi 17 */}
                                    {this.state.time.getUTCHours() > 17 ? this.state.time.getUTCHours()-17 : this.state.time.getUTCHours()+7} : {this.state.time.getUTCMinutes() > 9? this.state.time.getUTCMinutes() : "0" + this.state.time.getUTCMinutes()}
                                </Text>
                            </View>                
                            <View style={styles.row}>
                                <Text style={styles.place}>
                                    {this.props.place}
                                </Text>
                            </View>
                            <View style={[styles.row,{justifyContent:'flex-start'}]}>
                                {this.state.done ? <Image style={[styles.bottomIcon,{marginLeft:0}]} source={require('../assets/images/check-mark.png')}></Image> : null}                                
                                {this.state.remind ? <Image style={[styles.bottomIcon, {left:12}]} source={require('../assets/images/timer.png')}></Image> : null}
                            </View>                        
                        </View>                                     
                    </TouchableWithoutFeedback>
                </View>                
                
                <Animated.View style={[styles.buttonBox,{
                        transform:[{
                            translateX: this.state.slide
                        }]
                    }]}>
                    <LinearGradient colors={[ gradient1, gradient2]} style={styles.button}>                        
                        <TouchableWithoutFeedback style={styles.col}                            
                            onPressIn = {() => {this.setRemind()}}
                        >
                            <View style={styles.col}>
                                <Image style={styles.buttonImage} source={require('../assets/images/time_icon.png')}></Image>
                                <Text style={styles.buttonText}>Remind Me</Text>
                            </View>                                                
                        </TouchableWithoutFeedback>                        
                        <TouchableWithoutFeedback style={styles.col}
                            onPress={() => {this.setDone()}}
                        >
                            <View style={styles.col}>
                                <Image style={styles.buttonImage} source={require('../assets/images/task_icon.png')}></Image>
                                <Text style={styles.buttonText}>Mark as Done</Text>
                            </View>                        
                        </TouchableWithoutFeedback>
                    </LinearGradient>      
                </Animated.View>                
            </View>
        )
    }
}

const styles =  StyleSheet.create({
    buttonBox:{
        position:'absolute',
        right:0,
    },
    button:{
        position:'relative',
        flexDirection: 'row',
        borderTopLeftRadius:50,
        borderBottomLeftRadius:50,
        paddingVertical: 10,
        paddingHorizontal: 20,
        paddingLeft: 30,
        height: '100%',
        right:0,
    },
    itemBox:{
        zIndex: 0,
        position: 'relative',
    },
    container:{
        flex:1,
        paddingHorizontal:30,        
        paddingLeft: 40,
        position:'relative',
        overflow: 'hidden',
    },
    tWF:{
        flex:1,
        position:'relative',
        zIndex: 1
    },
    box:{
        borderLeftWidth: 1,
        borderLeftColor: '#888',
        paddingLeft: 20,
        paddingBottom: 30,
        paddingTop:10,
        position:'relative',            
    },
    lastBox:{
        borderLeftWidth: 1,
        borderLeftColor: '#888',
        paddingLeft: 20,
        paddingBottom: 30,
        paddingTop:10,
        position:'relative', 
        marginBottom: 50,   
        borderLeftWidth:0     
    },
    whiteBorder:{
        width:1,
        position: 'absolute',
        zIndex:999,
        top:0,
        left:0,
        backgroundColor:'#888',
        height: 10      
    },
    iconBox:{
        width: 25,
        height:25,
        borderRadius:50,
        borderColor: '#888',
        borderWidth:1,
        position: 'absolute',
        backgroundColor:'white',
        zIndex: 999,
        top: 10,
        left:-12.5,
        alignItems:'center',
        justifyContent: 'center',
    },
    iconImage:{
        position:'relative',
        width: '70%',
        height: '70%',
    },
    row:{
        flex:1,
        position: 'relative',
        flexDirection:'row',
        justifyContent: 'space-between',
    },
    title:{
        color: '#666',
        fontFamily: 'Montserrat-Bold',
        fontSize: 14,
    },
    time:{
        color: '#666',
        fontFamily: 'Montserrat-Regular',
        fontSize: 14,
    },
    place:{
        marginTop:5,
        color: '#666',
        fontFamily: 'Montserrat-Regular',
        fontSize: 12,
    },
    
    col:{
        margin: 5,
        justifyContent:'center',
        alignItems:'center',
        position:'relative',
    },
    buttonImage:{
        width: 30,
        height: 30,
    },
    buttonText:{
        color: '#f4f4f4',
        fontFamily:'Montserrat-Regular',
        fontSize: 12,
        marginTop: 5
    },
    bottomIcon:{
        width: 16,
        height: 16,
        marginHorizontal: 10,
        marginVertical: 0,
        position:'absolute',
        bottom:-24,
        opacity: 0.5
    }
});