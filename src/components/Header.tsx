import React, { useState, useEffect, useContext, createRef } from 'react';
import { Image, View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { fontFamily, fontColor } from '../config/config';
import Strings from '../config/strings';
import { Context } from '../utils/Context';
import NavigationService from './../services/NavigationService';
import { RealmController } from '../database/RealmController';
import LoginDetailsSchema from '../database/LoginSchema';
let realm = RealmController.getRealmInstance();
import { useIsFocused } from '@react-navigation/native';


const HEIGHT = Dimensions.get("window").height;

const Header = (props: any) => {

    const [userName, setUserName] = useState('Guest');
    const isFocused = useIsFocused();

    useEffect(() => {
        debugger;
        let obj = RealmController.getLoginData(realm, LoginDetailsSchema.name);
        if (obj) {
            let userName = obj[0].username.split('.')[0];
            setUserName(userName);
        }
    }, [isFocused])


    return (

        <View style={{ flex: 1.5 }}>
            <TouchableOpacity
                onPress={() => {
                    NavigationService.navigate('Profile');
                }} style={{ flex: 1, alignItems: props.isArabic ? 'flex-start' : 'flex-end', justifyContent: 'flex-end', alignSelf: 'center', width: '90%' }}>
                <View style={{ flex: 0.1 }} />
                <View style={{ flex: 0.6 }}>
                    <Image style={{ alignSelf: props.isArabic ? 'flex-start' : 'flex-end' }} source={require('./../assets/images/login/ProfileIcon.png')} />
                </View>
                <View style={{ flex: 0.1 }} />
                <View style={{ flex: 0.3 }}>
                    <Text style={{ color: fontColor.TitleColor, fontSize: props.isArabic ? 12 : 10, textAlign: 'center', fontWeight: 'bold', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[props.isArabic ? 'ar' : 'en'].header.welcome)} </Text>
                    <Text style={{ color: fontColor.TitleColor, fontSize: props.isArabic ? 12 : 10, textAlign: 'center', fontWeight: 'bold', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{userName} </Text>
                </View>
            </TouchableOpacity>

            <View style={{
                flex: 0.5, flexDirection: props.isArabic ? 'row-reverse' : 'row', width: '90%',
                alignSelf: 'center', justifyContent: 'space-evenly', alignItems: 'center'
            }}>
                {props.isDashborad ?
                    <View style={{ flex: 1.5 }} />
                    :
                    <TouchableOpacity
                        onPress={() => {
                            if (props.screenName == 'sampling' || props.screenName == 'condemnation' || props.screenName == 'detention') {
                                props.goBack();
                            }
                            else {
                                NavigationService.goBack();
                            }
                        }} style={{ flex: 1.5 }}>


                        <Image style={{ alignSelf: 'center', transform: [{ rotate: props.isArabic ? '180deg' : '0deg' }] }} source={require('./../assets/images/login/back.png')} />
                    </TouchableOpacity>
                }

                <View style={{ flex: 6, alignItems: 'center', alignSelf: 'center', justifyContent: 'center' }}>
                    {props.isDashborad ?
                        <Image style={{ width: 100, height: 100 }} source={props.isDashborad ? require('./../assets/images/logo-size/SmartControlLogo128.png') : require('./../assets/images/logo-size/SmartControlLogo128.png')} />
                        :
                        <Image style={{ width: 55, height: 55 }} source={props.isDashborad ? require('./../assets/images/logo-size/SmartControlLogo128.png') : require('./../assets/images/logo-size/SmartControl_Logo.png')} />
                    }
                </View>
                <View style={{ flex: 1.5 }} />
            </View>
        </View>

    );

}

export default Header;