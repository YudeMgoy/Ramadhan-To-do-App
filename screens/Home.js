import React from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,    
    Text,
    Image,
    StatusBar,    
    ScrollView,
    Dimensions,
    Animated,
    AsyncStorage,
    DeviceEventEmitter,
    TouchableWithoutFeedback
} from 'react-native';
import {API_KEY} from  '../utils/WeatherAPIKey';
import Geolocation from '@react-native-community/geolocation';
import LinearGradient from 'react-native-linear-gradient';
import Item from '../components/Item';
import AddActivity from './AddActivity';
import countries from '../utils/countries';
import ReactNativeAN from 'react-native-alarm-notification';

import {primaryColor,gradient1,gradient2, greeting} from '../utils/colors';

export default class Home extends React.Component {    
    constructor(props) {
        super(props);    
        
        //AsyncStorage.removeItem('acts');           
        this.setAlarm = this.setAlarm.bind(this);        
        this.getActs();           
        this.getDone();  
    }

    async componentDidMount(){
        this.getDate();
        this.getWeather();            

        setInterval( async () => {
            this.getWeather();
        },1000*60);   
                
        DeviceEventEmitter.addListener('OnNotificationDismissed', async function(e) {
			const obj = JSON.parse(e);
			console.log(`Notification id: ${obj.id} dismissed`);
		});
		
		DeviceEventEmitter.addListener('OnNotificationOpened', async function(e) {
			const obj = JSON.parse(e);
			console.log(obj);
		}); 
    }

    componentWillUnmount() {
		DeviceEventEmitter.removeListener('OnNotificationDismissed');
		DeviceEventEmitter.removeListener('OnNotificationOpened');
	}

    state = {
        scroll:  new Animated.Value(370),
        pos: new Animated.Value(0),
        opacity: new Animated.Value(1),
        offsetY: 0,
        settingPopScale: new Animated.Value(0),
        showAdd:false,
        acts: [],
        dones: 0,
        temp: 0,
        day: new Date().getDay(),        
        date:  new Date().getDate(),
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
        city: '',
        countryId: '', 
        icon: '',        
        showSettingPop: false
    }   

    setAlarm = (notifData, fireDate) => {
        const details  = { ...notifData, fire_date: fireDate };
        console.log(`alarm set: ${fireDate}`);
        this.setState({ update: `alarm set: ${fireDate}` });
        ReactNativeAN.scheduleAlarm(details);
    };

    getDate(){                        
        switch(this.state.day){
            case 1: 
                this.setState({day:'Mon'});
                break;
            case 2: 
                this.setState({day:'Tue'});
                break;
            case 3: 
                this.setState({day:'Wed'});
                break;
            case 4: 
                this.setState({day:'Thu'});
                break;
            case 5: 
                this.setState({day:'Fri'});
                break;
            case 6: 
                this.setState({day:'Sat'});
                break;
            default: 
                this.setState({day:'Sun'});
                break;
        }

        switch(this.state.month){
            case 0: 
                this.setState({month:'Jan'});
                break;
            case 1: 
                this.setState({month:'Feb'});
                break;
            case 2: 
                this.setState({month:'Mar'});
                break;
            case 3: 
                this.setState({month:'Apr'});
                break;
            case 4: 
                this.setState({month:'May'});
                break;
            case 5: 
                this.setState({month:'Jun'});
                break;
            case 6: 
                this.setState({month:'Jul'});
                break;
            case 7: 
                this.setState({month:'Aug'});
                break;
            case 8: 
                this.setState({month:'Sep'});
                break;
            case 9: 
                this.setState({month:'Oct'});
                break;
            case 10: 
                this.setState({month:'Nov'});
                break;
            default: 
                this.setState({month:'Des'});
                break;
        }

        this.setState({
            year:this.state.year.toString().substring(this.state.year.toString().length,this.state.year.toString().length-2)
        })
    }

    getWeather(){
        Geolocation.getCurrentPosition(
            position => {
                this.fetchWeather(position.coords.latitude, position.coords.longitude);                
            },
            error => {
                this.setState({
                    error: 'Error Gettig Weather Condtions'
                });
            }
        );
    }
    
    fetchWeather(lat, lon) {
        fetch(
            `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}&units=metric`
        )
        .then(res => res.json())
        .then(json => {
            let icon;
            json.weather.filter(obj => {
                icon = obj.icon;
            })
            this.setState({
                temp:json.main.temp,
                city:json.name,
                countryId: json.sys.country,
                icon:icon
            });           
        });
    }
    
    getActs = () => {
        AsyncStorage.getItem('acts', (error,result) => {
            if(result){
                this.setState({acts:JSON.parse(result)})                
            }
        });        
    }

    getDone = async () =>{
        await AsyncStorage.getItem('acts_done', (error, result) => {
            if(result){
                this.setState({dones:result.split(',').length-2})
            }
        })
    }     

    _onScrollBeginDrag = (event) => {
        this.setState({
            offsetY:event.nativeEvent.contentOffset.y
        });
    };

    settingClick(){        
        if(this.state.showSettingPop){
            Animated.timing(this.state.settingPopScale,{
                toValue: 0,
                duration: 200,
                useNativeDriver: true    
            }).start();        

            this.setState({showSettingPop:false});
        }else{
            Animated.timing(this.state.settingPopScale,{
                toValue: 1,
                duration: 200,
                useNativeDriver: true    
            }).start();        
            this.setState({showSettingPop:true});
        }        
    }

    changeName(){
        Animated.timing(this.state.settingPopScale,{
            toValue: 0,
            duration: 200,
            useNativeDriver: true    
        }).start();        

        this.setState({showSettingPop:false});
        this.props.resetName();
    }

    _onScroll = (event) => {
        if(event.nativeEvent.contentOffset.y > this.state.offsetY){
            Animated.timing(this.state.scroll, {
                toValue: 150,
                duration: 250,
            }).start();

            Animated.timing(this.state.pos,{
                toValue: -100,
                duration:200,
                useNativeDriver: true    
            }).start()

            Animated.timing(this.state.opacity,{
                toValue: 0,
                duration:200,
                useNativeDriver: true    
            }).start()
        }
        if(event.nativeEvent.contentOffset.y < this.state.offsetY){
            Animated.timing(this.state.scroll, {
                toValue: 370,
                duration: 250,
            }).start();

            Animated.timing(this.state.pos,{
                toValue: 0,
                duration:200,
                useNativeDriver: true    
            }).start()

            Animated.timing(this.state.opacity,{
                toValue: 1,
                duration:200,
                useNativeDriver: true    
            }).start();
        }
                     
    }

    render(){
        return(
            <View style={styles.container}>
                <StatusBar backgroundColor={gradient1}></StatusBar>
                <Animated.View style={[styles.topBg, {padding:0,paddingTop:0, 
                    height: this.state.scroll
                }]}>
                    <LinearGradient 
                        colors={[ gradient1,gradient2,]}                    
                        style={styles.topBg}
                    >
                        <Image
                            style={styles.bgImage}
                            source={require('../assets/images/masjid.png')}
                        ></Image>
                        <View style={styles.welcomeBox}>
                            <Text style={styles.welcomeText}>Good {greeting}, {this.props.name}</Text>
                            <TouchableOpacity onPress={()=>{this.settingClick()}}>
                                <Image
                                    style={styles.pengaturanButton}
                                    source={require('../assets/images/pengaturan.png')}
                                ></Image>
                            </TouchableOpacity>
                            <Animated.View 
                                style={[styles.settingPop,{transform:[{scale:this.state.settingPopScale}]}]}                       
                            >
                                <TouchableWithoutFeedback onPress={() => this.changeName()} style={styles.settingPopButton}>
                                    <Text style={styles.settingPopText}>Change Name</Text>
                                </TouchableWithoutFeedback>
                            </Animated.View>
                        </View>
                        <Animated.View 
                            style={[styles.bodyBox,{transform:[{translateY:this.state.pos}],opacity:this.state.opacity}]}                        
                        >
                            <View style={styles.weatherBox}>
                                <Image
                                    style={styles.weatherIcon}
                                    source={{uri: "http://openweathermap.org/img/wn/"+this.state.icon+".png"}}
                                ></Image>
                                <Text style={styles.derajatNum}>{Math.round(this.state.temp)}</Text>
                                <Text style={styles.derajatSimbol}>o</Text>
                                <Text style={styles.cText}>C</Text>
                            </View>       
                            {countries.map((item, key) => (
                                item.code == this.state.countryId ?
                                <Text style={styles.addressText}>                                
                                    {this.state.city} , {item.name}                                   
                                </Text>          : null    
                            ))}   
                            <View style={styles.tagBox}>
                                <Text style={[styles.tag,styles.firstTag]}>{this.state.day}, {this.state.date} {this.state.month} {this.state.year}</Text>
                                <Text style={styles.tag}>Acts {this.state.dones}/{this.state.acts.length}</Text>
                            </View>
                        </Animated.View>
                    </LinearGradient>
                </Animated.View>                

                <View style={styles.container}>
                    <Image
                        style={styles.gelombang}
                        source={require('../assets/images/gelombang.png')}
                    >
                    </Image>

                    <TouchableOpacity
                        style={[styles.addButton, {backgroundColor: primaryColor}]}
                        onPress={()=>{this.setState({showAdd:!this.state.showAdd});}}
                    >
                        <Text style={{fontFamily:'Montserrat-Medium', color: 'white',fontSize: 30}}>+</Text>
                    </TouchableOpacity>
                    
                    <ScrollView                         
                        onScroll={this._onScroll}
                        onScrollBeginDrag={this._onScrollBeginDrag}
                        alwaysBounceVertical={true}
                        style={styles.activityBox}
                        scrollEventThrottle={16}
                    >
                        <Text style={styles.activityTitle}>Activities</Text>
                        <View style={styles.list}>
                            {this.state.acts.map((item, key) => (
                                //key is the index of the array 
                                //item is the single item of the array                                    
                                key+1 == this.state.acts.length ? <Item id={key} getDone={this.getDone} setAlarm={this.setAlarm} box={item.box} last={true} time={item.time} name={item.name} place={item.place} category={item.category}/> : <Item id={key} box={item.box} last={false} time={item.time} setAlarm={this.setAlarm} getDone={this.getDone} name={item.name} place={item.place} category={item.category}/>
                            ))}
                        </View>                         
                    </ScrollView>
                    <Image source={require('../assets/images/borderTop.png')} style={styles.borderTop}></Image>
                </View>
                <AddActivity showAdd={this.state.showAdd} getActs={this.getActs}/>
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
    },
    borderTop:{
        height: 80,
        width: '100%',
        position:'absolute',
        top:-10,  
    },
    topBg:{        
        height: 370,    
        padding: 40,
        paddingTop: 25,
        position: 'relative',
        overflow: 'hidden'
    },
    bgImage:{
        position: 'absolute',
        bottom: 20,
        right: 0,
        width: 270,
        height: 270
    },
    welcomeBox:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },  
    welcomeText:{
        fontFamily: "Montserrat-Regular",
        fontSize: 22,
        color: '#f4f4f4',
        maxWidth: 280    
    },
    pengaturanButton:{
        width: 27,
        height: 27,
    },
    settingPop:{
        position:'absolute',
        right: 0,
        top: 30,
        backgroundColor: "#f4f4f4",
        width: 120,
        padding: 10,
        borderRadius: 5
    },
    settingPopText:{
        fontFamily: 'Montserrat-Regular',
        color: "#333",
        fontSize: 12
    },
    bodyBox: {
        position: 'relative',
        marginTop: 80,
    },  
    weatherBox: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'flex-end',
    },  
    weatherIcon:{
        width: 35,
        height: 25,
        marginBottom: 16
    },
    derajatNum:{
        color: '#f4f4f4',
        fontSize: 70,
        fontFamily: 'Montserrat-Regular',
        marginTop: 'auto',
        paddingBottom: 0,
        marginBottom: 0,
        lineHeight: 70,
    },
    derajatSimbol:{
        color: '#f4f4f4',
        fontFamily: 'Montserrat-Regular',        
        marginTop: -20,
        marginBottom: 'auto',
        fontSize: 20,
    },  
    cText:{
        color: '#f4f4f4',
        fontFamily: 'Montserrat-Regular',   
        fontSize: 24,
        lineHeight: 60
    },
    addressText:{
        color: '#f4f4f4',
        fontFamily: 'Montserrat-Regular',        
        marginTop: -10,
        fontSize: 14,
    },
    tagBox:{
        flexDirection: 'row',
    },  
    tag:{
        padding: 5,
        paddingRight: 10,
        paddingLeft: 10,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.3)',        
        margin:5,        
        fontSize: 12,
        fontFamily: 'Montserrat-Bold',
        color: 'white'
    },
    firstTag:{
        marginLeft: 0,
    },
    gelombang: {
        position: 'absolute',    
        width: Dimensions.get('window').width,                     
        height: 150,
        top: -50,
        left: 0,
    },
    addButton:{
        borderRadius: 50,
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',        
        position: 'absolute',
        right: 30,
        top: -20,
        elevation:5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.8,
        shadowRadius: 5,      
        zIndex:99999        
    },
    activityBox: {
        marginTop: 10,
        padding: 30,
        paddingLeft:0,
        paddingRight:0
    },
    activityTitle:{
        fontFamily: "Montserrat-Regular",
        fontSize: 20,
        color: '#555',
        marginLeft:30,
        backgroundColor:'white',
        paddingBottom:20,
        position: 'relative',
        width: 100,
        zIndex: 1
    },
    list:{
        marginTop:-10,
        position:'relative'
    }
})