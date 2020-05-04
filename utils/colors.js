import React from 'react';
import { View } from 'react-native';

export var primaryColor = "#689DFF";//Blue : #689DFF
export var gradient1 = "#689dff";//Blue : #689dff
export var gradient2 = "#437adf";//Blue : #437adf
export var greeting = "Morning";

export default class Colors extends React.Component{
    constructor(props){
        super(props);

        this.checkTime();    
    }

    checkTime(){
        let time = new Date().getHours();

        //Night
        if(time >= 18 || (time <= 7)){
            primaryColor = "#AF7AF0";
            gradient1 = "#AF7AF0";
            gradient2 = "#5B51CF";
            greeting = "Evening";
        }

        //Morning
        if(time >= 8 && time <= 11){
            primaryColor = "#FAB669";
            gradient1 = "#FFBF87";
            gradient2 = "#D97F30";
            greeting = "Morning";
        }

        //Day
        if(time >= 12 && time <= 17){
            primaryColor = "#6E9CF0";
            gradient1 = "#94B9FF";
            gradient2 = "#5D8EE8";
            greeting = "Day";
        }
    }

    render(){
        return(
            <View></View>
        )
    }
}