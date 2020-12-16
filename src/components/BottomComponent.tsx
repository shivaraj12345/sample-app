
import React, { useContext, useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Alert, Dimensions
} from 'react-native';

import NavigationService from './../services/NavigationService';
import { observer } from 'mobx-react';
import { RootStoreModel } from "../store/rootStore";
import useInject from "../hooks/useInject";
import { fontFamily, fontColor } from '../config/config';
import Strings from '../config/strings';
import TaskSchema from '../database/TaskSchema';
import { RealmController } from '../database/RealmController';
let realm = RealmController.getRealmInstance();
import { Context } from '../utils/Context';

const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;

const BottomComponent = (props: any) => {

    const context = useContext(Context);
    const [taskList, setTaskList] = useState(Array());
    const mapStore = (rootStore: RootStoreModel) => ({ bottomBarDraft: rootStore.bottomBarModel, completedTaskDraft: rootStore.completdMyTaskModel, alertDraft: rootStore.foodAlertsModel, myTasksDraft: rootStore.myTasksModel })
    const { bottomBarDraft, myTasksDraft, alertDraft, completedTaskDraft } = useInject(mapStore)
    debugger
    let foodAlertResponse1 = alertDraft.alertResponse != '' ? JSON.parse(alertDraft.alertResponse) : [];

    useEffect(() => {

        let taskArray: any = [];
        debugger;
        completedTaskDraft.setState('pending')
        taskArray = RealmController.getTasks(realm, TaskSchema.name);
        let completedTaskArray = [];
        debugger;

        if (taskArray && taskArray['0']) {
            completedTaskArray = Object.values(taskArray)
            completedTaskArray = completedTaskArray.filter((i: any) => i.isCompleted == true);
            myTasksDraft.setIsCompletedOfflineList(JSON.stringify(completedTaskArray));
            completedTaskDraft.setCompletedTaskArray(JSON.stringify(completedTaskArray));
            setTaskList(completedTaskArray)
        }
        // else {
        //     let Arr = completedTaskDraft.completedTaskArray != '' ? JSON.parse(completedTaskDraft.completedTaskArray) : Array();
        //     setTaskList(Arr);
        // }
        completedTaskDraft.setState('done')

    }, [completedTaskDraft.completedTaskArray]);

    return (

        <View style={{ flex: 1, flexDirection: props.isArabic ? 'row-reverse' : 'row', width: '100%', alignSelf: 'center', borderTopColor: 'red', borderTopWidth: 1, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>

            <TouchableOpacity
                onPress={() => {
                    bottomBarDraft.setDashboardClisk(true);
                    bottomBarDraft.setCategoryClisk(false);
                    bottomBarDraft.setCalenderClisk(false);
                    bottomBarDraft.setProfileClisk(false);
                    NavigationService.navigate('Dashboard');
                }}
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                {/* <View style={{ flex: 0.1 }} /> */}
                <View style={{ flex: 0.5, flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <Image style={{ transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                        source={require('./../assets/images/bottom/Home.png')} />
                </View>
                <View style={{ flex: 0.6, width: '100%', justifyContent: 'flex-start' }}>
                    <Text numberOfLines={2} style={{ fontSize: 11, fontWeight: 'normal', width: '100%', textAlign: 'center', color: fontColor.TitleColor, fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily }}>{Strings[props.isArabic ? 'ar' : 'en'].bottomText.home}</Text>
                </View>
                {/* <View style={{ flex: 0.1 }} /> */}
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => {
                    bottomBarDraft.setDashboardClisk(false);
                    bottomBarDraft.setCategoryClisk(true);
                    bottomBarDraft.setCalenderClisk(false);
                    bottomBarDraft.setProfileClisk(false);
                    alertDraft.setState('pending')
                    NavigationService.navigate('FoodAlerts')
                }}
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >

                {/* <View style={{ flex: 0.1 }} /> */}

                <View style={{ flex: 0.5, flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ height: WIDTH * 0.04, width: WIDTH * 0.04, left: props.isArabic ? +8 : +32, top: 0, justifyContent: 'center', alignItems: 'center', borderColor: 'gray', borderRadius: 50, borderWidth: 0.2, alignSelf: 'center', backgroundColor: 'red', zIndex: 10 }}>
                        <Text style={[{ color: 'white', fontSize: 8, fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }]}>{foodAlertResponse1.length}</Text>
                    </View>
                    <Image style={{ marginRight: 12, transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                        source={require('./../assets/images/bottom/foodAlerts.png')} />
                </View>
                <View style={{ flex: 0.6, width: '100%', justifyContent: 'flex-start' }}>
                    <Text numberOfLines={2} style={{ fontSize: 11, fontWeight: 'normal', width: '100%', textAlign: 'center', color: fontColor.TitleColor, fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily }}>{Strings[props.isArabic ? 'ar' : 'en'].bottomText.foodAlerts}</Text>
                </View>

                {/* <View style={{ flex: 0.1 }} /> */}

            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => {
                    bottomBarDraft.setDashboardClisk(false);
                    bottomBarDraft.setCategoryClisk(false);
                    bottomBarDraft.setCalenderClisk(false);
                    bottomBarDraft.setProfileClisk(true);
                    NavigationService.navigate('Reminder')
                }}
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >

                <View style={{ flex: 0.5, flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ height: WIDTH * 0.04, width: WIDTH * 0.04, left: props.isArabic ? +8 : +32, top: 0, justifyContent: 'center', alignItems: 'center', borderColor: 'gray', borderRadius: 50, borderWidth: 0.2, alignSelf: 'center', backgroundColor: 'red', zIndex: 10 }}>
                        <Text style={[{ color: 'white', fontSize: 8, fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }]}>{'4'}</Text>
                    </View>
                    <Image style={{ marginRight: 12, transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                        source={require('./../assets/images/bottom/reminders.png')} />
                </View>
                <View style={{ flex: 0.6, flexDirection: 'row', width: '100%', justifyContent: 'flex-start' }}>
                    <Text numberOfLines={2} style={{ fontSize: 11, fontWeight: 'normal', width: '100%', textAlign: 'center', color: fontColor.TitleColor, fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily }}>{Strings[props.isArabic ? 'ar' : 'en'].bottomText.reminders}</Text>
                </View>

                <View style={{ flex: 0.1 }} />

            </TouchableOpacity>

            {/* <TouchableOpacity
                onPress={() => {
                    bottomBarDraft.setDashboardClisk(false);
                    bottomBarDraft.setCategoryClisk(false);
                    bottomBarDraft.setCalenderClisk(false);
                    bottomBarDraft.setProfileClisk(true);
                   // NavigationService.navigate('CondemnationForm')
                }}
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >

                <View style={{ flex: 0.1 }} />


                <View style={{ flex: 0.5, flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ height: WIDTH * 0.04, width: WIDTH * 0.04, right: -32, top: 0, justifyContent: 'center', alignItems: 'center', borderColor: 'gray', borderRadius: 50, borderWidth: 0.2, alignSelf: 'center', backgroundColor: 'red' }}>
                        <Text style={[{ color: 'white', fontSize: 8 }]}>{'2'}</Text>
                    </View>
                    <Image style={{ transform: [{ rotateY: '0deg' }] }}
                        source={require('./../assets/images/bottom/reminders.png')} />
                </View>

                <View style={{ flex: 0.3, flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <Text numberOfLines={2} style={{ fontSize: 11, fontWeight: 'bold', textAlign: 'center', color: '#a7a7a9', }}>{Strings[context.isArabic ? 'ar' : 'en'].bottomText.reminders}</Text>
                </View>

                <View style={{ flex: 0.1 }} />

            </TouchableOpacity>

     */}
            <TouchableOpacity
                onPress={() => {
                    bottomBarDraft.setDashboardClisk(false);
                    bottomBarDraft.setCategoryClisk(false);
                    bottomBarDraft.setCalenderClisk(false);
                    bottomBarDraft.setProfileClisk(true);
                    myTasksDraft.setIsMyTaskClick('CompletedTask');
                    NavigationService.navigate('CompletedTask');
                }}
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >

                <View style={{ flex: 0.5, flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ height: WIDTH * 0.04, width: WIDTH * 0.04, left: props.isArabic ? +8 : +32, top: 0, justifyContent: 'center', alignItems: 'center', borderColor: 'gray', borderRadius: 50, borderWidth: 0.2, alignSelf: 'center', backgroundColor: 'red', zIndex: 10 }}>
                        <Text style={[{ color: 'white', fontSize: 8, fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }]}>{taskList.length}</Text>
                    </View>
                    <Image style={{ marginRight: 12, transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                        source={require('./../assets/images/bottom/completedTask.png')} />
                </View>
                <View style={{ flex: 0.6, flexDirection: 'row', width: '100%', justifyContent: 'flex-start' }}>
                    <Text numberOfLines={2} style={{ fontSize: 11, fontWeight: 'normal', width: '100%', textAlign: 'center', color: fontColor.TitleColor, fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily }}>{Strings[props.isArabic ? 'ar' : 'en'].bottomText.completedTasks}</Text>
                </View>

                <View style={{ flex: 0.1 }} />

            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => {
                    bottomBarDraft.setDashboardClisk(false);
                    bottomBarDraft.setCategoryClisk(false);
                    bottomBarDraft.setCalenderClisk(true);
                    bottomBarDraft.setProfileClisk(false);
                    NavigationService.navigate('Settings')
                }}
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                {/* <View style={{ flex: 0.1 }} /> */}
                <View style={{ flex: 0.5, flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <Image style={{ transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                        source={require('./../assets/images/bottom/settings.png')} />
                </View>
                <View style={{ flex: 0.6, flexDirection: 'row', width: '100%', justifyContent: 'flex-start' }}>
                    <Text numberOfLines={2} style={{ fontSize: 11, fontWeight: 'normal', width: '100%', textAlign: 'center', color: fontColor.TitleColor, fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily }}>{Strings[props.isArabic ? 'ar' : 'en'].bottomText.settings}</Text>
                </View>
                {/* <View style={{ flex: 0.1 }} /> */}
            </TouchableOpacity>

        </View>
    );

}

var styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        fontSize: 18,
        fontFamily: 'Gill Sans',
        textAlign: 'center',
        margin: 10,
        color: '#ffffff',
        backgroundColor: 'transparent',
    },
});

export default observer(BottomComponent);