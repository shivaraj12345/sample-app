import React, { useContext, useState, useEffect, useRef } from 'react';
import { Image, View, FlatList, Linking, SafeAreaView, TouchableOpacity, Text, ImageBackground, Dimensions, ScrollView, Alert, PermissionsAndroid, ToastAndroid, BackHandler, Platform, TextInput } from "react-native";
import { useIsFocused } from '@react-navigation/native';
import NavigationService from '../services/NavigationService';
import Header from './../components/Header';
import KeyValueComponent from './../components/KeyValueComponent';
import BottomComponent from './../components/BottomComponent';
import { observer } from 'mobx-react';
import { Context, value } from '../utils/Context';
import Strings from '../config/strings';
import { fontFamily, fontColor, alertResponse } from '../config/config';
import { RootStoreModel } from '../store/rootStore';
import useInject from "../hooks/useInject";

import Dropdown from '../components/dropdown';
import { RealmController } from '../database/RealmController';
import SearchComponent from '../../src/components/SearchComponent';
import EstablishmentSchema from '../database/EstablishmentSchema';
import AllEstablishmentSchema from '../database/AllEstablishmentSchema';
let realm = RealmController.getRealmInstance();
import Spinner from 'react-native-loading-spinner-overlay';
import TaskSchema from '../database/TaskSchema';
import Swipeout from 'react-native-swipeout';

const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
let moment = require('moment');

const MyTasks = (props: any) => {
    const context = useContext(Context);
    const [taskList, setTaskList] = useState(Array());
    //let initialTaskList = Array();
    const [initialTaskList, setInitialTaskList] = useState(Array());

    let dropdownRef4 = useRef(null);
    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel, alertDraft: rootStore.foodAlertsModel, establishmentDraft: rootStore.establishmentModel, licenseDraft: rootStore.licenseMyTaskModel })
    const { myTasksDraft, alertDraft, establishmentDraft, licenseDraft } = useInject(mapStore)

    useEffect(() => {

        let currentTaskList = Array();
        debugger
        // myTasksDraft.setState('pending')
        if (myTasksDraft.isMyTaskClick == 'myTask') {
            if (myTasksDraft.dataArray1 != '')
                //    setTaskList(JSON.parse(myTasksDraft.dataArray1));
                currentTaskList = JSON.parse(myTasksDraft.dataArray1);
        }
        else if (myTasksDraft.isMyTaskClick == 'case') {
            if (myTasksDraft.complaintAndFoodPosioningList != '')
                //    setTaskList(JSON.parse(myTasksDraft.complaintAndFoodPosioningList));
                currentTaskList = JSON.parse(myTasksDraft.complaintAndFoodPosioningList);
        }
        else if (myTasksDraft.isMyTaskClick == 'license') {
            if (myTasksDraft.NOCList != '')
                // setTaskList(JSON.parse(myTasksDraft.NOCList));
                currentTaskList = JSON.parse(myTasksDraft.NOCList);
        }
        else if (myTasksDraft.isMyTaskClick == 'tempPermit') {
            if (myTasksDraft.eventsList != '')
                //    setTaskList(JSON.parse(myTasksDraft.eventsList));
                currentTaskList = JSON.parse(myTasksDraft.eventsList);
        }
        else if (myTasksDraft.isMyTaskClick == 'campaign') {
            if (myTasksDraft.campaignList != '') {
                // setTaskList(JSON.parse(myTasksDraft.campaignList));
                currentTaskList = JSON.parse(myTasksDraft.campaignList);
            }
        }
        else {
            if (myTasksDraft.dataArray1 != '')
                // setTaskList(JSON.parse(myTasksDraft.dataArray1));
                currentTaskList = JSON.parse(myTasksDraft.dataArray1);

        }
        debugger
        let temp = currentTaskList
        // .filter((item) => {

        //     if (item.isCompleted == false) {
        //         return item;
        //     }
        // });

        setTaskList(temp);
        setInitialTaskList(temp);

        debugger;
        // let arr = RealmController.getTaskDetails(realm, TaskSchema.name, myTasksDraft.taskId);
        debugger;
        // console.log('arr ' + JSON.parse(arr));

    }, []);

    const sortArr = [
        { type: 'Status', value: 'Status' },
        { type: 'Date', value: 'Date' },
        { type: 'Priority', value: 'Priority' },
        { type: 'Completion Date', value: 'Completion Date' },
    ];

    const swipeoutBtns =
    {
        text: "sampling",
        right: [
            { text: 'Sampling', type: 'primary', backgroundColor: '#5C666F', color: '#abcfbf', onPress: function () { Alert.alert('sampling pressed') }, },
            { text: 'Condemnation', type: 'secondary', backgroundColor: '#5C666F', color: '#abcfbf', onPress: function () { Alert.alert('sdadsa pressed') }, },
            { text: 'Detention', type: 'delete', backgroundColor: '#5C666F', color: '#abcfbf', onPress: function () { Alert.alert('sfseffsf pressed') }, }
        ],
        autoClose: true,
    }

    // useEffect(() => {

    //     if (myTasksDraft.state === 'getBASuccess') {
    //         myTasksDraft.callToGetChecklistApi(myTasksDraft.desc);
    //         myTasksDraft.setState('done');
    //     }

    // }, [myTasksDraft.state === 'getBASuccess']);

    // useEffect(() => {
    //     debugger;
    //     if (myTasksDraft.state == 'getChecklistSuccess') {
    //         NavigationService.navigate('EstablishmentDetails');
    //         myTasksDraft.setState('done');
    //     }
    // }, [myTasksDraft.state == 'getChecklistSuccess']);

    const onChangeSearch = (str: string) => {
        if (str != '') {
            let temp = [];

            temp = initialTaskList.filter((item) => {

                if ((item.TaskId.toString().indexOf(str) > -1) || (item.TaskType.toString().indexOf(str) > -1)
                    || (item.TaskStatus.toString().indexOf(str) > -1)) {
                    return item;
                }
            });
            setTaskList(temp);
        }
        else {
            let temp = initialTaskList;
            if (temp.length) {
                setTaskList(initialTaskList);
            }
        }
    }

    const onSortBy = (value: string) => {

        let data;

        if (value === 'Status') {
            let temp = [];
            temp = [...taskList].sort((a: any, b: any) => a.TaskStatus.localeCompare(b.TaskStatus));

            setTaskList(temp);
            console.log(value);

        }
        if (value === 'Date') {

            let temp = [];
            temp = [...taskList].sort((a: any, b: any) => a.TaskId.localeCompare(b.TaskId));
            setTaskList(temp);
            console.log(value);
        }
        if (value === 'Priority') {
            let temp = [];
            temp = [...taskList].sort((a: any, b: any) => a.TaskPriority == null ? 0 : a.TaskPriority.localeCompare(b.TaskPriority));
            console.log("after sorting priority", temp[0].TaskPriority, temp[1].TaskPriority, temp[2].TaskPriority);
            setTaskList(temp);
            console.log(value);
        }
        if (value === 'Date') {
            let temp = [];
            temp = [...taskList].sort((a: any, b: any) => a.TaskId.localeCompare(b.TaskId));
            console.log("after sorting", temp[0]);
            setTaskList(temp);
            console.log(value);
        }
        if (value === 'Completion Date') {
            let temp = [];
            temp = [...taskList].sort((a: any, b: any) => a.CompletionDate.localeCompare(b.CompletionDate));
            setTaskList(temp);
            console.log(value);
        }
    };

    const callToGetBA = (inspectionDetails: any) => {

        debugger;
        myTasksDraft.setTaskId(inspectionDetails.TaskId);

        if (myTasksDraft.isMyTaskClick == 'adhoc') {
            // NavigationService.navigate('ViolationDetails')
        }
        else if (myTasksDraft.isMyTaskClick == 'myTask' && inspectionDetails.TaskType == 'Closure Inspection') {
            let licenseCode = inspectionDetails.LicenseCode;
            // NavigationService.navigate('ClosureInspection', { 'licenseNum': licenseCode });

        }
        else {

            if (myTasksDraft.isMyTaskClick == 'license' || myTasksDraft.isMyTaskClick == 'case' || myTasksDraft.isMyTaskClick == 'tempPermit') {

                debugger;

                if (inspectionDetails.TaskType == 'Complaints' || inspectionDetails.TaskType == 'Follow-Up') {
                    myTasksDraft.setSelectedTask(JSON.stringify(inspectionDetails))
                    myTasksDraft.setTaskId(inspectionDetails.TaskId);
                    if (inspectionDetails.Description != '' && inspectionDetails.Description != null && inspectionDetails.Description != 'null') {
                        myTasksDraft.setDesc(inspectionDetails.Description);
                        myTasksDraft.callToGetBAApi(inspectionDetails);
                    }
                    else {
                        ToastAndroid.show('No Checklist Available', 1000);
                    }
                }
                else if (inspectionDetails.TaskType == 'Temporary Routine Inspection') {

                    if (inspectionDetails.EstablishmentId && inspectionDetails.EstablishmentId != '') {
                        if (inspectionDetails.Description != '' && inspectionDetails.Description != null && inspectionDetails.Description != 'null') {
                            myTasksDraft.setDesc(inspectionDetails.Description);
                            myTasksDraft.callToGetBAApi(inspectionDetails);
                        }
                    }
                    else {
                        myTasksDraft.callToGetChecklistApi(inspectionDetails, context.isArabic);
                    }
                }
                else if (inspectionDetails.TaskType.toLowerCase() == 'noc inspection' || inspectionDetails.TaskType.toLowerCase() == "temporary noc inspection") {

                    licenseDraft.callToGetNocChecklist(inspectionDetails.TaskType);
                }
                else {
                    licenseDraft.setTaskId(inspectionDetails.TaskId);
                    if (inspectionDetails.Description != '' && inspectionDetails.Description != null && inspectionDetails.Description != 'null') {
                        myTasksDraft.setDesc(inspectionDetails.Description);
                        licenseDraft.callToGetNocChecklist(inspectionDetails.TaskType);
                    }
                }
            }
            else if (inspectionDetails.TaskType.toString().toLowerCase() == 'follow-up') {
                let TaskId = inspectionDetails.TaskId;
                myTasksDraft.callToGetQuestionaries(context.isArabic ? 'AR' : 'ENU', TaskId);
            }
            else if (inspectionDetails.TaskType.toString().toLowerCase() == 'campaign inspection') {
                let TaskId = inspectionDetails.TaskId;
                let campaignType = '';
                if (inspectionDetails.CampaignType == null) {
                    campaignType = '';
                }
                else {
                    campaignType = inspectionDetails.CampaignType;
                }
                //myTasksDraft.callToGetCampaignChecklistApi(campaignType);
            }
            else {
                myTasksDraft.setSelectedTask(JSON.stringify(inspectionDetails))
                myTasksDraft.setTaskId(inspectionDetails.TaskId);

                if (inspectionDetails.Description != '' && inspectionDetails.Description != null && inspectionDetails.Description != 'null') {
                    myTasksDraft.setDesc(inspectionDetails.Description);
                    myTasksDraft.callToGetBAApi(inspectionDetails);
                    // myTasksDraft.callToGetChecklistApi(inspectionDetails, context.isArabic);
                }
                else {
                    // ToastAndroid.show('No Checklist Available', 1000);
                }
            }
        }
    }

    const renderMyTask = (item: any, index: number) => {

        return (
            // <Swipeout right={swipeoutBtns.right} left={swipeoutBtns.left} autoClose={swipeoutBtns.autoClose}>

            <TouchableOpacity
                onPress={() => {
                    let temp = RealmController.getEstablishmentById(realm, EstablishmentSchema.name, item.EstablishmentId);
                    let temp1 = RealmController.getSingleXlsxEstablishmentById(realm, AllEstablishmentSchema.name, item.EstablishmentId);

                    myTasksDraft.setTaskId(item.TaskId);
                    myTasksDraft.setSelectedTask(JSON.stringify(item));
                    myTasksDraft.setNoCheckList('')
                    debugger;
                    callToGetBA(item);
                    if ((item.TaskType.toString().toLowerCase() == 'routine inspection') || item.TaskType.toString().toLowerCase() == 'direct inspection') {
                        myTasksDraft.callToGetChecklistApi(item, context.isArabic);
                    }

                    if (myTasksDraft.isMyTaskClick == 'adhoc') {
                        NavigationService.navigate('ViolationDetails')
                    } else if (myTasksDraft.isMyTaskClick == 'campaign') {
                        NavigationService.navigate('CampaignDetails', { 'inspectionDetails': item })
                    }
                    else {
                        debugger
                        if (temp && temp[0]) {
                            establishmentDraft.setAddress(temp[0].PrimaryAddressId ? temp[0].PrimaryAddressId : '')
                            establishmentDraft.setArea(temp[0].Area ? temp[0].Area : '')
                            establishmentDraft.setSector(temp[0].Sector ? temp[0].Sector : '')
                            establishmentDraft.setContactDetails(temp[0].Sector ? temp[0].Sector : '')
                            establishmentDraft.setEstablishmentName(context.isArabic ? temp[0].ArabicName ? temp[0].ArabicName : '' : temp[0].EnglishName ? temp[0].EnglishName : '')
                            establishmentDraft.setLicenseEndDate(temp[0].LicenseExpiryDate ? temp[0].LicenseExpiryDate : '')
                            establishmentDraft.setLicenseStartDate(temp[0].LicenseRegDate ? temp[0].LicenseRegDate : '')
                            establishmentDraft.setLicenseNumber(temp[0].LicenseNumber ? temp[0].LicenseNumber : '')
                            establishmentDraft.setLicenseSource(temp[0].LicenseSource ? temp[0].LicenseSource : '')
                        }
                        else if (temp1 && temp1[0]) {
                            establishmentDraft.setAddress(temp[0].ADDRESS ? temp[0].ADDRESS : '')
                            establishmentDraft.setArea(temp[0].AREA ? temp[0].AREA : '')
                            establishmentDraft.setSector(temp[0].Sector ? temp[0].Sector : '')
                            establishmentDraft.setContactDetails(temp[0].MOBILE_NUMBER ? temp[0].MOBILE_NUMBER : '')
                            establishmentDraft.setEstablishmentName(context.isArabic ? temp[0].PREMISE_NAME_AR ? temp[0].PREMISE_NAME_AR : '' : temp[0].PREMISE_NAME ? temp[0].PREMISE_NAME : '')
                            establishmentDraft.setLicenseEndDate(temp[0].LicenseExpiryDate ? temp[0].LicenseExpiryDate : '')
                            establishmentDraft.setLicenseStartDate(temp[0].LicenseRegDate ? temp[0].LicenseRegDate : '')
                            establishmentDraft.setLicenseNumber(temp[0].TL_NUMBER ? temp[0].TL_NUMBER : '')
                            establishmentDraft.setLicenseSource(temp[0].SOURCE ? temp[0].SOURCE : '')
                        }
                        else {
                            debugger;
                            establishmentDraft.callToAccountSyncService(item.LicenseNumber, context.isArabic);
                        }

                        NavigationService.navigate('EstablishmentDetails', { 'inspectionDetails': item });
                    }
                    debugger
                   
                }}
                key={item.inspectionId}
                style={[context.isArabic ? { borderTopLeftRadius: 10, borderBottomLeftRadius: 10, borderRightColor: '#d51e17', borderRightWidth: 5, borderLeftColor: '#5C666F' } : { borderTopRightRadius: 10, borderBottomRightRadius: 10, borderLeftColor: '#d51e17', borderLeftWidth: 5, borderRightColor: '#5C666F' }, {
                    height: 100, width: '100%', alignSelf: 'center', justifyContent: 'center', borderWidth: 1, shadowRadius: 1, backgroundColor: 'white', borderTopColor: '#5C666F', borderBottomColor: '#5C666F', shadowOpacity: 15, shadowColor: 'grey', elevation: 0
                }]}>

                {myTasksDraft.isMyTaskClick == 'adhoc' ? <KeyValueComponent isArabic={context.isArabic} keyName={(Strings[context.isArabic ? 'ar' : 'en'].violationDetails.violationID)} value={item.TaskId} /> : null}

                <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                    {(item.TaskId && item.TaskId != '') ?
                        <KeyValueComponent isArabic={context.isArabic} keyName={''} value={item.TaskId} />
                        : null}
                    {myTasksDraft.isMyTaskClick == 'adhoc' ? <KeyValueComponent isArabic={context.isArabic} keyName={(Strings[context.isArabic ? 'ar' : 'en'].violationDetails.status)} value={item.TaskStatus} />
                        : <KeyValueComponent isArabic={context.isArabic} keyName={''} value={item.TaskType} />}
                </View>

                <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                    {item.completionDateWithDayRemaining && item.completionDateWithDayRemaining != '' ?
                        <KeyValueComponent isArabic={context.isArabic} keyName={''} value={item.completionDateWithDayRemaining} />
                        : null}
                    {item.LicenseNumber && item.LicenseNumber != '' ?
                        <KeyValueComponent isArabic={context.isArabic} keyName={''} value={item.LicenseNumber ? item.LicenseNumber : ''} />
                        : null}
                </View>

                <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                    {item.completionDateWithDayRemaining && item.completionDateWithDayRemaining != '' ?
                        <KeyValueComponent isArabic={context.isArabic} keyName={''} value={item.CompletionDate ? moment(item.CompletionDate).format('L') : null} />
                        : null}
                    {(((item.TaskType.toString().toLowerCase() == 'routine inspection') || (item.TaskType.toString().toLowerCase() == 'direct inspection')) && (item.Description == '' || item.Description == null)) ?
                        <KeyValueComponent isError={true} isArabic={context.isArabic} keyName={''} value={'No Checklist'} />
                        : null}
                </View>
            </TouchableOpacity>

            // </Swipeout>
        )
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>

            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../assets/images/backgroundimgReverse.jpg') : require('./../assets/images/backgroundimg.jpg')}>

                <Spinner
                    visible={licenseDraft.state == 'pending' || myTasksDraft.state == 'pending' ? true : false}
                    // textContent={'Loading...'}
                    overlayColor={'rgba(0,0,0,0.7)'}
                    color={'#b6a176'}
                    textStyle={{ fontSize: 14, color: 'white' }}
                />

                <View style={{ flex: 1.5 }}>
                    <Header isArabic={context.isArabic} />
                </View>

                <View style={{ flex: 1.5 }}>

                    <View style={{ flex: 1, flexDirection: 'row', width: '80%', alignSelf: 'center' }}>

                        <View style={{ flex: myTasksDraft.isMyTaskClick == 'tempPermit' ? 0.5 : 1 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                        <View style={{ flex: myTasksDraft.isMyTaskClick == 'tempPermit' ? 1.5 : 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: fontColor.TitleColor, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily, fontSize: 18, fontWeight: 'bold' }}>{myTasksDraft.isMyTaskClick == 'CompletedTask' ? Strings[context.isArabic ? 'ar' : 'en'].dashboard.completedTesk : myTasksDraft.isMyTaskClick == 'case' ? Strings[context.isArabic ? 'ar' : 'en'].dashboard.cases : myTasksDraft.isMyTaskClick == 'license' ? Strings[context.isArabic ? 'ar' : 'en'].dashboard.licenses : myTasksDraft.isMyTaskClick == 'adhoc' ? Strings[context.isArabic ? 'ar' : 'en'].violationDetails.adhoc : myTasksDraft.isMyTaskClick == 'scheduled' ? Strings[context.isArabic ? 'ar' : 'en'].scheduled.scheduled : myTasksDraft.isMyTaskClick == 'tempPermit' ? Strings[context.isArabic ? 'ar' : 'en'].dashboard.temporaryPermits : myTasksDraft.isMyTaskClick == 'campaign' ? Strings[context.isArabic ? 'ar' : 'en'].campaignDetails.campaign : Strings[context.isArabic ? 'ar' : 'en'].myTask.myTask}</Text>
                        </View>

                        <View style={{ flex: myTasksDraft.isMyTaskClick == 'tempPermit' ? 0.5 : 1 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>
                    </View>

                    <View style={{ flex: 0.6, width: '85%', alignSelf: 'center' }}>
                        <SearchComponent isArabic={context.isArabic}
                            onChangeSearch={(val: string) => {
                                onChangeSearch(val)
                            }} />
                    </View>
                    <View style={{ flex: 0.2, width: '90%', alignSelf: 'center' }}>
                        <TouchableOpacity onPress={() => {
                            dropdownRef4 && dropdownRef4.current.focus();
                        }}
                            style={{
                                height: '70%', width: '60%'
                            }} >
                            <Text style={{ color: fontColor.TitleColor, fontSize: 14, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].dashboard.sort)} </Text>
                            <Dropdown
                                ref={dropdownRef4}
                                onChangeText={onSortBy}
                                itemTextStyle={{ width: '80%', height: '80%', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, textAlign: context.isArabic ? 'center' : 'center', fontSize: 10, padding: 0, color: fontColor.TextBoxTitleColor }}
                                containerStyle={{ width: '100%', height: '100%', alignSelf: 'flex-start' }}
                                data={sortArr}
                            />
                        </TouchableOpacity>
                    </View>

                </View>

                {myTasksDraft.isMyTaskClick == 'adhoc' ?
                    <View style={{ flex: 0.4, flexDirection: 'row', width: '80%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 18, backgroundColor: '#c4ddd2' }}>
                        <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].violationDetails.violationList)} </Text>
                    </View>
                    :
                    myTasksDraft.isMyTaskClick == 'scheduled' ?
                        <View style={{ flex: 0.4, flexDirection: 'row', width: '80%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 18, backgroundColor: '#c4ddd2' }}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].scheduled.complaints)} </Text>
                        </View>
                        :

                        null
                }

                <View style={{ flex: myTasksDraft.isMyTaskClick ? 5.6 : 6, width: '80%', alignSelf: 'center' }}>
                    <View style={{ height: myTasksDraft.isMyTaskClick ? 18 : 30 }} />
                    <FlatList
                        nestedScrollEnabled={true}
                        data={taskList}
                        renderItem={({ item, index }) => {
                            return (
                                renderMyTask(item, index)
                            )
                        }}
                        ItemSeparatorComponent={() => <View style={{ height: 18 }} />}
                    />

                </View>
                <View style={{ flex: 1 }}>
                    <BottomComponent isArabic={context.isArabic} />
                </View>
            </ImageBackground>
        </SafeAreaView>
    )
}


export default observer(MyTasks);