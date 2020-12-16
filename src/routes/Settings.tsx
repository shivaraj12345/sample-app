import React, { useContext, useState, useRef, useEffect } from 'react';
import { Image, View, Switch, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, Text, ImageBackground, Dimensions } from "react-native";
import Header from '../components/Header';
import BottomComponent from '../components/BottomComponent';
import TextComponent from '../components/TextComponent';
import ResetPasswordComponent from './../components/ResetPasswordComponent';
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
import { fontFamily, fontColor } from '../config/config';
import Strings from '../config/strings';
import { observer } from 'mobx-react';
import { Context } from '../utils/Context';
import Accordion from 'react-native-collapsible/Accordion';
import RegistrationComponent from '../components/RegistrationComponent';
import { RootStoreModel } from '../store/rootStore';
import useInject from "../hooks/useInject";
let realm = RealmController.getRealmInstance();

import { RealmController } from '../database/RealmController';

const Settings = (props: any) => {
    const context = useContext(Context);
    const [activeSections, setSection] = useState([]);
    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel })
    const { myTasksDraft } = useInject(mapStore)
    const Sections = [
        { title: Strings[context.isArabic ? 'ar' : 'en'].settings.editUserProfile,type: "registration" },
        { title: Strings[context.isArabic ? 'ar' : 'en'].settings.changePassword, type: 'resetPassword' },
        { title: Strings[context.isArabic ? 'ar' : 'en'].settings.notification, type: 'notification' },

    ];

    const renderAccordionHeader = (content: any, index: any, isActive: any) => {
        return (
            <View style={{ minHeight: HEIGHT * 0.01, height: 'auto', backgroundColor: '#abcfbf', flexDirection: context.isArabic ? 'row-reverse' : 'row', width: '90%', padding: 5, alignSelf: 'center', marginBottom: 5, borderRadius: 22 }}>
                <View style={{ flex: 8.4, justifyContent: 'center', alignItems: context.isArabic ? 'flex-end' : 'flex-start', paddingHorizontal: 10 }}>
                    <TextComponent
                        textStyle={{ color: '#5c666f', textAlign: context.isArabic ? 'right' : 'left', fontSize: 12, fontFamily: fontFamily.tittleFontFamily, fontWeight: 'normal' }}
                        label={content.title}
                    />

                </View>
                <View style={{ flex: 0.1 }} />
                <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center', height: 25, }}>

                    {content.type == 'notification' ?
                        <Switch
                            thumbColor={fontColor.TitleColor}
                            trackColor={{ true: 'white', false: 'white' }}
                            onValueChange={(val) => {

                            }}
                            value={context.isArabic} /> :
                        isActive ? <Image
                            source={require("./../assets/images/startInspection/Grey/Arrow.png")}
                            style={{ height: 22, width: 22, alignItems: 'flex-end', transform: context.isArabic ? [{ rotate: '90deg' }] : [{ rotate: '90deg' }] }}
                            resizeMode={'contain'}
                        />
                            :
                            <Image
                                source={require("./../assets/images/startInspection/Grey/Arrow.png")}
                                style={{ height: 22, width: 22, alignItems: 'flex-end', transform: context.isArabic ? [{ rotate: '-180deg' }] : [{ rotate: '0deg' }] }}
                                resizeMode={'contain'}
                            />
                    }
                </View>
            </View>
        );
    };

    const renderContent = (item: any) => {
        return (
            item.type == 'registration' ? <RegistrationComponent isArabic={context.isArabic} /> :
            item.type == 'resetPassword' ? <ResetPasswordComponent isArabic={context.isArabic} /> : null

        );
    };

    const updateSections = (activeSections: any) => {
        setSection(activeSections.includes(undefined) ? [] : activeSections);
    };

    return (

        <SafeAreaView style={{ flex: 1 }}>

            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../assets/images/backgroundimgReverse.jpg') : require('./../assets/images/backgroundimg.jpg')}>
                <View style={{ flex: 1.5, }}>
                    <Header isArabic={context.isArabic} />
                </View>
                <View style={{ flex: 0.6 }}>
                    <View style={{ flex: 1, flexDirection: 'row', width: '80%', alignSelf: 'center' }}>

                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 16, fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].settings.settings)}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>
                    </View>
                </View>

                <View style={{ flex: 1.5, alignItems: 'center', alignSelf: 'center', justifyContent: 'center', width: '90%' }}>
                    <Image resizeMode={'stretch'} style={{ width: 120, height: 120 }} source={require('./../assets/images/profile/Profile64x64.png')} />
                </View>
                <View style={{ flex: 0.3 }} />
                <View style={{ flex: 4.9, width: '80%', alignSelf: 'center' }}>
                    <ScrollView>
                        <Accordion
                            sections={Sections}
                            activeSections={activeSections}
                            renderHeader={renderAccordionHeader}
                            renderContent={renderContent}
                            touchableComponent={TouchableOpacity}
                            onChange={updateSections}
                        />
                        <View style={{ height: 15 }} />
                        <View style={{ flex: 1, height: 35, width: '85%', alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity
                                onPress={() => {

                                }}
                                style={{ backgroundColor: "#5c666f", height: '80%', justifyContent: 'center', alignItems: 'center', width: 100, borderRadius: 10 }}>
                                <Text style={{ fontWeight: 'bold',fontFamily:context.isArabic?fontFamily.arabicTextFontFamily:fontFamily.textFontFamily,fontSize:13,color: 'white' }}>{Strings[context.isArabic ? 'ar' : 'en'].settings.logOut}</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
                <View style={{ flex: 1 }}>
                    <BottomComponent isArabic={context.isArabic} />
                </View>
            </ImageBackground>
        </SafeAreaView >
    )
}
const styles = StyleSheet.create({
    TextInputContainer: {
        flex: 0.6,
        justifyContent: "center",
        alignSelf: 'center',

    },
    space: {
        flex: 0.0
    },
    textContainer: {
        flex: 0.4,
        justifyContent: 'center',
    },

});

export default observer(Settings);
